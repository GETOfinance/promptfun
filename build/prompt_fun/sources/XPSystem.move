module prompt_fun::XPSystem {
    use std::signer;
    use aptos_std::table::{Self, Table};
    use std::error;

    struct XPStore has key {
        points: Table<address, u64>,
    }

    /// Error codes
    const EXP_STORE_NOT_INITIALIZED: u64 = 1;
    const EUSER_NOT_FOUND: u64 = 2;

    public entry fun init_xp(account: &signer) {
        let addr = signer::address_of(account);
        if (!exists<XPStore>(addr)) {
            move_to(account, XPStore {
                points: table::new<address, u64>(),
            });
        }
    }

    public entry fun add_xp(account: &signer, user: address, xp: u64) acquires XPStore {
        let addr = signer::address_of(account);
        
        // Initialize store if it doesn't exist
        if (!exists<XPStore>(addr)) {
            move_to(account, XPStore {
                points: table::new<address, u64>(),
            });
        };
        
        let store = borrow_global_mut<XPStore>(addr);
        let existing = table::borrow_mut_with_default(&mut store.points, user, 0);
        *existing = *existing + xp;
    }

    #[view]
    public fun get_xp(account: address): u64 acquires XPStore {
        assert!(exists<XPStore>(account), error::not_found(EXP_STORE_NOT_INITIALIZED));
        let store = borrow_global<XPStore>(account);
        if (table::contains(&store.points, account)) {
            *table::borrow(&store.points, account)
        } else {
            0
        }
    }

    #[view]
    public fun get_user_xp(store_owner: address, user: address): u64 acquires XPStore {
        assert!(exists<XPStore>(store_owner), error::not_found(EXP_STORE_NOT_INITIALIZED));
        let store = borrow_global<XPStore>(store_owner);
        if (table::contains(&store.points, user)) {
            *table::borrow(&store.points, user)
        } else {
            0
        }
    }

    #[view]
    public fun xp_store_exists(account: address): bool {
        exists<XPStore>(account)
    }
} 

