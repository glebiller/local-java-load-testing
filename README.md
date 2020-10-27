# local java load testing

run grafana dashboard in background using
`docker-compose up -d`

then run performance test located in `tests` folder
`docker-compose run k6 run /scripts/test.js`

## Sample

visualise the sample run by running
`docker run -p 80:80 -v /path/to/sample/:/usr/share/nginx/html:ro nginx:alpine`
