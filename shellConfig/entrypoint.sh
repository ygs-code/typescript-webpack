#!/bin/bash

set -e

echo "Logging in to Azure..."
az login --service-principal -u $INPUT_AZURE_CREDENTIALS -p $INPUT_AZURE_PASSWORD --tenant $INPUT_AZURE_TENANT

echo "Deploying to Azure..."
az webapp up --name $INPUT_APP_NAME --resource-group $INPUT_RESOURCE_GROUP

echo "Deployment completed!"