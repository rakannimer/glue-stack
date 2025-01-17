# Running Locally

We support Mac primarily and linux with best-efforts.

## Setup

This takes about 30 mins to download ~2gb of tools on a fresh mac on a 12mbps connection.

1. Open Terminal \(CMD + Space, type Terminal\)

2. Install xcode command line tools.

   ```
   xcode-select --install
   ```

3. Create or just cd into your development folder

   ```text
   cd ~
   mkdir development
   cd development
   ```

4. Checkout this repository

   ```text
   git clone https://github.com/cadbox1/glue-stack.git
   cd glue-stack
   ```

5. Run the setup bash script

   ```text
   sh setup.sh
   ```

   You can open the bash script to find out but it:

   - installs Homebrew
   - installs Java
   - installs Docker
   - installs Maven
   - installs Node
   - installs Yarn

   Hit Enter when you're prompted.
   You will need to enter your password for both Homebrew and Docker. Type it in but be aware that password characters aren't displayed in terminal.
   You'll need to enter your password again when Docker first opens.

## Running

1. Create a new terminal tab \(CMD + t\)

2. Start the MySQL database using

   ```text
   docker-compose up
   ```

3. Create a new terminal tab \(CMD + t\)

4. The next tab will run the api \(backend\).

   ```text
   cd api
   mvn spring-boot:run
   ```

   This will start our Spring Boot Java application which will setup the tables in our database using a tool called Flyway.

5. The next tab will run our ui \(frontend\) development server. You won't need this in production.

```text
cd ui
yarn
yarn start
```

This will open a browser window to our application. Make sure both servers are started before your start playing with it.

11. Signup your organisation!
12. To stop any of the components hit `control + c` in the tab. This is how to stop running terminal programs.

Now that you've got it running perhaps you'd like to try [developing glue-stack](./DevelopmentProcess-Tasks.md)?
