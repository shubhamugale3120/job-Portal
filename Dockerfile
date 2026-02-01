 
# Step 1: Choose base image (operating system + Node.js)
FROM node:18-alpine

# Step 2: Set working directory inside container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install --production

# Step 5: Copy entire project code
COPY . .

# Step 6: Expose port (tells Docker app runs on 3000)
EXPOSE 3000

# Step 7: Health check (checks if app is running)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Step 8: Start the application
CMD ["npm", "start"]
 