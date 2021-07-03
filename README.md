# local java load testing

run grafana dashboard in background using
`docker compose up -d`

then run performance test located in `tests` folder
`docker compose run k6 run /scripts/run.js`

the results are visible in the grafana dashboard at
`http://localhost:3000/`    

## Sample

available [here](https://kissy.github.io/local-java-load-testing/) or run locally with docker
`docker run -p 80:80 -v $(pwd)/docs/:/usr/share/nginx/html/local-java-load-testing/:ro nginx:alpine`
and browser `http://localhost/local-java-load-testing/`

