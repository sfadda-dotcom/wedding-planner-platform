
#!/bin/bash

# Navigate to the app directory
cd app

# Generate Prisma client
yarn prisma generate

# Build the Next.js application
yarn build
