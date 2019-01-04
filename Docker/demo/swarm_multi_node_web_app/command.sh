# swarm
docker swarm init
# add worker (operate on the target node)
docker swarm join --token SWMTKN-1-34mve3ypgnp0vwytvaj02zckb3i4290zec2pug7k9ltw4jfoxp-eb64oitr94ka587vwdteevydt 192.168.0.33:2377

docker network create --driver overlay backend
docker network create --driver overlay frontend
# docker network ls

# vote node
docker service create --name vote --network frontend --replicas 2 -p 80:80 dockersamples/examplevotingapp_vote:before
# docker service ps vote

# redis node
docker service create --name redis --network frontend redis:3.2

# worker node
docker service create --name worker --network frontend --network backend dockersamples/examplevotingapp_worker

# docker service create --name worker --network frontend dockersamples/examplevotingapp_worker
# docker network connect backend worker.1.yau25jhdwio13y955do5ltmva

# db node
docker service create --name db --mount type=volume,source=db-data,target=/var/lib/postgresql/data --network backend postgres:9.4

# result node
docker service create --name result -p 5678:80 --network backend dockersamples/examplevotingapp_result:before

# click port on the website to see the web!!!
# ip:5678 won't work
# https://labs.play-with-docker.com