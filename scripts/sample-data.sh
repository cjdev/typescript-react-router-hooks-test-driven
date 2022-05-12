#!/usr/bin/env bash

set -e
set -x

profiles_id=$(curl -X POST -d '{ "name": "Profiles Requirements" }' http://localhost:8080/profile)
tasks_id=$(curl -X POST -d '{ "name": "Tasks Requirements" }' http://localhost:8080/profile)
summary_id=$(curl -X POST -d '{ "name": "Summary Requirements" }' http://localhost:8080/profile)
navigation_id=$(curl -X POST -d '{ "name": "Navigation Requirements" }' http://localhost:8080/profile)
setup_data_id=$(curl -X POST -d '{ "name": "Setup Data" }' http://localhost:8080/profile)

curl -X POST -d "{ \"profile\": \"${profiles_id}\"    , \"name\":\"Display all profiles\", \"complete\":false }" http://localhost:8080/task
curl -X POST -d "{ \"profile\": \"${profiles_id}\"    , \"name\":\"Add a profile\", \"complete\":false }" http://localhost:8080/task
curl -X POST -d "{ \"profile\": \"${profiles_id}\"    , \"name\":\"Remove a profile\", \"complete\":false }" http://localhost:8080/task
curl -X POST -d "{ \"profile\": \"${profiles_id}\"    , \"name\":\"Navigate to tasks associated with a particular profile\", \"complete\":false }" http://localhost:8080/task

curl -X POST -d "{ \"profile\": \"${tasks_id}\"    , \"name\":\"Display all tasks for a particular profile\", \"complete\":false }" http://localhost:8080/task
curl -X POST -d "{ \"profile\": \"${tasks_id}\"    , \"name\":\"Add a task\", \"complete\":false }" http://localhost:8080/task
curl -X POST -d "{ \"profile\": \"${tasks_id}\"    , \"name\":\"Mark a task as complete\", \"complete\":false }" http://localhost:8080/task
curl -X POST -d "{ \"profile\": \"${tasks_id}\"    , \"name\":\"Clear all completed tasks\", \"complete\":false }" http://localhost:8080/task
curl -X POST -d "{ \"profile\": \"${tasks_id}\"    , \"name\":\"Navigate to profiles\", \"complete\":false }" http://localhost:8080/task

curl -X POST -d "{ \"profile\": \"${summary_id}\"    , \"name\":\"Display the total number of profiles\", \"complete\":false }" http://localhost:8080/task
curl -X POST -d "{ \"profile\": \"${summary_id}\"    , \"name\":\"Display the total number of tasks\", \"complete\":false }" http://localhost:8080/task
curl -X POST -d "{ \"profile\": \"${summary_id}\"    , \"name\":\"Be visible on every page\", \"complete\":false }" http://localhost:8080/task
curl -X POST -d "{ \"profile\": \"${summary_id}\"    , \"name\":\"Immediately update as the underlying data changes\", \"complete\":false }" http://localhost:8080/task

curl -X POST -d "{ \"profile\": \"${navigation_id}\"    , \"name\":\"Profiles and Tasks are displayed on different pages\", \"complete\":false }" http://localhost:8080/task
curl -X POST -d "{ \"profile\": \"${navigation_id}\"    , \"name\":\"Bookmarked pages should work\", \"complete\":false }" http://localhost:8080/task
curl -X POST -d "{ \"profile\": \"${navigation_id}\"    , \"name\":\"Back button should work\", \"complete\":false }" http://localhost:8080/task

curl -X POST -d "{ \"profile\": \"${setup_data_id}\"    , \"name\":\"Load sample data\", \"complete\":true }" http://localhost:8080/task