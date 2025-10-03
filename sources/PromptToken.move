module prompt_fun::PromptToken {
    use std::string;
    use std::signer;
    use aptos_std::table::{Self, Table};
    use std::error;

    struct Token has key, store, copy {
        name: string::String,
        symbol: string::String,
        creator: address,
        total_supply: u64,
    }

    struct TokenStore has key {
        tokens: Table<string::String, Token>,
    }

    /// Error codes
    const ETOKEN_STORE_NOT_INITIALIZED: u64 = 1;
    const ETOKEN_ALREADY_EXISTS: u64 = 2;
    const ETOKEN_NOT_FOUND: u64 = 3;

    public entry fun init_store(account: &signer) {
        let addr = signer::address_of(account);
        if (!exists<TokenStore>(addr)) {
            move_to(account, TokenStore {
                tokens: table::new<string::String, Token>(),
            });
        }
    }

    public entry fun create_token(account: &signer, name: string::String, symbol: string::String, supply: u64) acquires TokenStore {
        let addr = signer::address_of(account);
        
        // Initialize store if it doesn't exist
        if (!exists<TokenStore>(addr)) {
            move_to(account, TokenStore {
                tokens: table::new<string::String, Token>(),
            });
        };
        
        let store = borrow_global_mut<TokenStore>(addr);
        assert!(!table::contains(&store.tokens, symbol), error::already_exists(ETOKEN_ALREADY_EXISTS));
        
        let token = Token {
            name,
            symbol: symbol,
            creator: addr,
            total_supply: supply,
        };
        table::add(&mut store.tokens, symbol, token);
    }

    public fun get_token(account: address, symbol: string::String): Token acquires TokenStore {
        assert!(exists<TokenStore>(account), error::not_found(ETOKEN_STORE_NOT_INITIALIZED));
        let store = borrow_global<TokenStore>(account);
        assert!(table::contains(&store.tokens, symbol), error::not_found(ETOKEN_NOT_FOUND));
        *table::borrow(&store.tokens, symbol)
    }

    public fun get_total_supply(account: address, symbol: string::String): u64 acquires TokenStore {
        assert!(exists<TokenStore>(account), error::not_found(ETOKEN_STORE_NOT_INITIALIZED));
        let store = borrow_global<TokenStore>(account);
        assert!(table::contains(&store.tokens, symbol), error::not_found(ETOKEN_NOT_FOUND));
        let token = table::borrow(&store.tokens, symbol);
        token.total_supply
    }

    #[view]
    public fun token_exists(account: address, symbol: string::String): bool acquires TokenStore {
        if (!exists<TokenStore>(account)) {
            return false
        };
        let store = borrow_global<TokenStore>(account);
        table::contains(&store.tokens, symbol)
    }
} 

