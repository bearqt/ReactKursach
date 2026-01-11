# Stage 1: Build React App
FROM node:20 AS client-build
WORKDIR /src

# Copy package.json and yarn.lock first for caching
COPY ClientApp/package.json ClientApp/yarn.lock ./ClientApp/
WORKDIR /src/ClientApp
RUN yarn install

# Copy the rest of the ClientApp source code
COPY ClientApp/ .

# Build the React app
# This will output files to /src/wwwroot due to webpack config: path.resolve(__dirname, '../wwwroot')
RUN yarn build

# Stage 2: Build .NET App
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore
COPY ReactAdvancedAppKursach.csproj .
RUN dotnet restore

# Copy the rest of the source code
COPY . .

# Copy the built React assets from the previous stage
# The webpack config outputted to ../wwwroot relative to ClientApp, so it's at /src/wwwroot in the client-build stage
COPY --from=client-build /src/wwwroot ./wwwroot

# Build and Publish
RUN dotnet publish -c Release -o /app/publish

# Generate the development certificate
RUN dotnet dev-certs https -ep /app/publish/aspnetapp.pfx -p password

# Stage 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
EXPOSE 8081
ENTRYPOINT ["dotnet", "ReactAdvancedAppKursach.dll"]