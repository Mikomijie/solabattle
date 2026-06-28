use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("11111111111111111111111111111111");

#[program]
pub mod battle_game {
    use super::*;

    pub fn initialize_game(ctx: Context<InitializeGame>) -> Result<()> {
        let game = &mut ctx.accounts.game_config;
        game.creator = ctx.accounts.creator.key();
        game.total_battles = 0;
        game.total_players = 0;
        Ok(())
    }

    pub fn register_player(ctx: Context<RegisterPlayer>) -> Result<()> {
        let player = &mut ctx.accounts.player_account;
        player.player_wallet = ctx.accounts.player.key();
        player.wins = 0;
        player.losses = 0;
        player.rank = 1;
        Ok(())
    }

    pub fn start_battle(ctx: Context<StartBattle>, opponent: Pubkey) -> Result<()> {
        let battle = &mut ctx.accounts.battle;
        battle.player1 = ctx.accounts.player1.key();
        battle.player2 = opponent;
        battle.winner = Pubkey::default();
        battle.status = BattleStatus::Active;
        battle.round = 1;
        battle.player1_hp = 100;
        battle.player2_hp = 100;
        Ok(())
    }

    pub fn execute_move(
        ctx: Context<ExecuteMove>,
        move_type: u8, // 1 = Attack, 2 = Defend, 3 = Special
    ) -> Result<()> {
        let battle = &mut ctx.accounts.battle;
        
        require!(battle.status == BattleStatus::Active, GameError::BattleNotActive);

        let damage = calculate_damage(move_type);

        if battle.player1 == ctx.accounts.player.key() {
            battle.player2_hp = battle.player2_hp.saturating_sub(damage);
        } else {
            battle.player1_hp = battle.player1_hp.saturating_sub(damage);
        }

        if battle.player1_hp == 0 {
            battle.winner = battle.player2;
            battle.status = BattleStatus::Ended;
        } else if battle.player2_hp == 0 {
            battle.winner = battle.player1;
            battle.status = BattleStatus::Ended;
        }

        battle.round += 1;

        Ok(())
    }

    pub fn end_battle(ctx: Context<EndBattle>) -> Result<()> {
        let battle = &ctx.accounts.battle;
        
        require!(battle.status == BattleStatus::Ended, GameError::BattleStillActive);

        let mut player1_account = ctx.accounts.player1_account.load_mut()?;
        let mut player2_account = ctx.accounts.player2_account.load_mut()?;

        if battle.winner == battle.player1 {
            player1_account.wins += 1;
            player2_account.losses += 1;
        } else {
            player2_account.wins += 1;
            player1_account.losses += 1;
        }

        Ok(())
    }

    pub fn get_player_stats(ctx: Context<GetPlayerStats>) -> Result<PlayerStats> {
        let player = ctx.accounts.player_account.load()?;
        Ok(PlayerStats {
            wins: player.wins,
            losses: player.losses,
            rank: player.rank,
        })
    }
}

fn calculate_damage(move_type: u8) -> u64 {
    match move_type {
        1 => 15, // Attack
        2 => 5,  // Defend (blocks damage)
        3 => 25, // Special (high damage)
        _ => 10, // Default
    }
}

#[derive(Accounts)]
pub struct InitializeGame<'info> {
    #[account(init, payer = creator, space = 8 + 32 + 8 + 8)]
    pub game_config: Account<'info, GameConfig>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterPlayer<'info> {
    #[account(init, payer = player, space = 8 + 32 + 8 + 8 + 8)]
    pub player_account: Account<'info, PlayerAccount>,
    #[account(mut)]
    pub player: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct StartBattle<'info> {
    #[account(init, payer = player1, space = 8 + 32 + 32 + 32 + 1 + 8 + 8 + 8)]
    pub battle: Account<'info, Battle>,
    #[account(mut)]
    pub player1: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExecuteMove<'info> {
    #[account(mut)]
    pub battle: Account<'info, Battle>,
    pub player: Signer<'info>,
}

#[derive(Accounts)]
pub struct EndBattle<'info> {
    pub battle: Account<'info, Battle>,
    #[account(mut)]
    pub player1_account: AccountLoader<'info, PlayerAccount>,
    #[account(mut)]
    pub player2_account: AccountLoader<'info, PlayerAccount>,
}

#[derive(Accounts)]
pub struct GetPlayerStats<'info> {
    pub player_account: AccountLoader<'info, PlayerAccount>,
}

#[account]
pub struct GameConfig {
    pub creator: Pubkey,
    pub total_battles: u64,
    pub total_players: u64,
}

#[account]
pub struct PlayerAccount {
    pub player_wallet: Pubkey,
    pub wins: u64,
    pub losses: u64,
    pub rank: u64,
}

#[account]
pub struct Battle {
    pub player1: Pubkey,
    pub player2: Pubkey,
    pub winner: Pubkey,
    pub status: BattleStatus,
    pub round: u64,
    pub player1_hp: u64,
    pub player2_hp: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum BattleStatus {
    Active,
    Ended,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct PlayerStats {
    pub wins: u64,
    pub losses: u64,
    pub rank: u64,
}

#[error_code]
pub enum GameError {
    #[msg("Battle is not active")]
    BattleNotActive,
    #[msg("Battle is still active")]
    BattleStillActive,
}