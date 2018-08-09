# Running Locally

We support Mac primarily and linux with best-efforts.

This takes about an hour to download all 1-2gb of tools on a fresh mac on a slow internet connection.

1. Open Terminal \(CMD + Space, type Terminal\)
2. Create or just cd into your development folder

   ```text
   cd ~
   mkdir development
   cd development
   ```

3. Checkout this repository

   ```text
   git clone https://github.com/cadbox1/glue-stack.git
   cd glue-stack
   ```

4. Install xcode command line tools.
   
   ```
   xcode-select --install
   ```

5. Run the setup bash script

   ```text
   sh setup.sh
   ```

   You can open the bash script to find out but it:

   * installs Homebrew
   * installs Java
   * installs Docker
   * installs Maven
   * installs Node
   * installs Yarn

    Hit Enter anytime you're prompted.
    If you're asked for your password enter it and hit enter. The characters won't be displayed in terminal.
    You'll need to enter your password to install docker.

6. Create a new terminal tab \(CMD + t\)
7. Start the MySQL database using

   ```text
   docker-compose up
   ```

8. Create a new terminal tab \(CMD + t\)
9.  The next tab will run the api \(backend\).

   ```text
   cd api
   mvn spring-boot:run
   ```

   This will start our Spring Boot Java application which will setup the tables in our database using a tool called Flyway.

11. The next tab will run our ui \(frontend\) development server. You won't need this in production.

   ```text
   cd ui
   yarn
   yarn start
   ```

   This will open a browser window to our application. Make sure both servers are started before your start playing with it.

11. Signup your organisation!
12. To stop any of the components hit `control + c` in the tab. This is how to stop running terminal programs.