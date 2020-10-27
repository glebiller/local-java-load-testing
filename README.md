# local java load testing

run grafana dashboard in background using
`docker-compose up -d`

then run performance test located in `tests` folder
`docker-compose run k6 run /scripts/test.js`

## Sample

available [here](https://kissy.github.io/local-java-load-testing/) or run locally with docker
`docker run -p 80:80 -v /absolute/path/to/docs/:/usr/share/nginx/html/local-java-load-testing/:ro nginx:alpine`
and browser `http://localhost/local-java-load-testing/`

