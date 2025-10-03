module prompt_fun::BondingCurve {
    use std::signer;
    use std::string;
    use aptos_std::table::{Self, Table};
    use std::error;

    struct CurveInfo has key, store {
        supply: u64,
        base_price: u64,
    }

    struct CurveStore has key {
        tokens: Table<string::String, CurveInfo>,
    }

    /// Error codes
    const ECURVE_STORE_NOT_INITIALIZED: u64 = 1;
    const ETOKEN_ALREADY_EXISTS: u64 = 2;
    const ETOKEN_NOT_FOUND: u64 = 3;
    const EINSUFFICIENT_PAYMENT: u64 = 4;
    const EINSUFFICIENT_SUPPLY: u64 = 5;

    public entry fun init_curve_store(account: &signer) {
        let addr = signer::address_of(account);
        if (!exists<CurveStore>(addr)) {
            move_to(account, CurveStore {
                tokens: table::new<string::String, CurveInfo>(),
            });
        }
    }

    public entry fun launch_token(account: &signer, symbol: string::String, base_price: u64) acquires CurveStore {
        let addr = signer::address_of(account);
        
        // Initialize store if it doesn't exist
        if (!exists<CurveStore>(addr)) {
            move_to(account, CurveStore {
                tokens: table::new<string::String, CurveInfo>(),
            });
        };
        
        let store = borrow_global_mut<CurveStore>(addr);
        assert!(!table::contains(&store.tokens, symbol), error::already_exists(ETOKEN_ALREADY_EXISTS));
        
        let curve = CurveInfo {
            supply: 0,
            base_price,
        };
        table::add(&mut store.tokens, symbol, curve);
    }

    public entry fun buy_token(account: &signer, symbol: string::String, amount: u64, payment: u64) acquires CurveStore {
        let addr = signer::address_of(account);
        assert!(exists<CurveStore>(addr), error::not_found(ECURVE_STORE_NOT_INITIALIZED));
        let store = borrow_global_mut<CurveStore>(addr);
        assert!(table::contains(&store.tokens, symbol), error::not_found(ETOKEN_NOT_FOUND));
        
        let curve = table::borrow_mut(&mut store.tokens, symbol);
        let price = curve.base_price * (curve.supply + amount); // Simple linear bonding curve
        assert!(payment >= price, error::invalid_argument(EINSUFFICIENT_PAYMENT));
        curve.supply = curve.supply + amount;
    }

    public fun sell_token(account: address, symbol: string::String, amount: u64): u64 acquires CurveStore {
        assert!(exists<CurveStore>(account), error::not_found(ECURVE_STORE_NOT_INITIALIZED));
        let store = borrow_global_mut<CurveStore>(account);
        assert!(table::contains(&store.tokens, symbol), error::not_found(ETOKEN_NOT_FOUND));
        
        let curve = table::borrow_mut(&mut store.tokens, symbol);
        assert!(curve.supply >= amount, error::invalid_argument(EINSUFFICIENT_SUPPLY));
        let refund = curve.base_price * amount; // simple reverse
        curve.supply = curve.supply - amount;
        refund
    }

    #[view]
    public fun token_exists(account: address, symbol: string::String): bool acquires CurveStore {
        if (!exists<CurveStore>(account)) {
            return false
        };
        let store = borrow_global<CurveStore>(account);
        table::contains(&store.tokens, symbol)
    }

    #[view]
    public fun get_token_supply(account: address, symbol: string::String): u64 acquires CurveStore {
        assert!(exists<CurveStore>(account), error::not_found(ECURVE_STORE_NOT_INITIALIZED));
        let store = borrow_global<CurveStore>(account);
        assert!(table::contains(&store.tokens, symbol), error::not_found(ETOKEN_NOT_FOUND));
        let curve = table::borrow(&store.tokens, symbol);
        curve.supply
    }

    #[view]
    public fun get_token_price(account: address, symbol: string::String): u64 acquires CurveStore {
        assert!(exists<CurveStore>(account), error::not_found(ECURVE_STORE_NOT_INITIALIZED));
        let store = borrow_global<CurveStore>(account);
        assert!(table::contains(&store.tokens, symbol), error::not_found(ETOKEN_NOT_FOUND));
        let curve = table::borrow(&store.tokens, symbol);
        curve.base_price
    }
} 

