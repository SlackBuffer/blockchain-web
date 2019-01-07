- https://github.com/hyperledger/blockchain-explorer

    ```
    ├── app            	 Application backend root, Explorer configuration
        ├── rest         REST API
        ├── persistence  Persistence layer
            ├── fabric   Persistence API (Hyperledger Fabric)
        ├── platform     Platforms
            ├── fabric   Explorer API (Hyperledger Fabric)
        ├── test         Application backend test
    ├── client         	 Web UI
        ├── public       Assets
        ├── src          Front end source code
            ├── components		React framework
            ├── services	  	Request library for API calls
            ├── state		    Redux framework
            ├── static       	Custom and Assets
    ```

- > [jq](https://stedolan.github.io/jq/) is a lightweight and flexible command-line JSON processor
- > Hyperledger [Cello](https://github.com/hyperledger/cello) is a blockchain provision and operation system, which helps manage blockchain networks in an efficient way
- Database setup
    - `app/explorerconfig.json`
- Fabric network setup
    - `app/platform/fabric/config.json`
- Fabric configure hyperledger explorer
    - `app/platform/fabric/config.json`
- `./start.sh` will have the backend up, `./stop.sh` will stop the node server
- `./syncstart.sh` will have the sync node up (pass network-id and client-id to start specific client sync process, else first network and client will be considered), `./syncstop.sh` will stop the sync node