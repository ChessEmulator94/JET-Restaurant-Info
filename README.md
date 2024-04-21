# JET Restaurant Finder @README

## SETUP (Mac)

### Node and NPM

1. Open terminal
2. Install node by running `brew install node`
3. Install npm by running `brew install npm`
4. Navigate to the project directory
5. Install project dependencies by running `npm install`


### Create the DB Schema:

NOTE: 
> It is highly suggested to install mysql workbench from `https://dev.mysql.com/downloads/workbench/` and configure your account from there. Once that is done, install mysql through brew so that you can use terminal to create the database with ease
> Without configuring the account in workbench, you may run into an issue whereby your localhost can't access the local database, if this happens you can consult `https://help.ubuntu.com/community/MysqlPasswordReset`

1.  Open terminal
3.  Install mysql by running `brew install mysql`
4.  Start MYSQL by running `brew services start mysql`
    > By default you can use user `root` and no password
5.  Open MySQL prompt by running `mysql -u [your_mysql_username] -p[your_password]`
    > From a fresh install of mysql you can use `mysql -u root -p` for this step
    > If you do have a password, make sure there is no space between -p and [your_password]
6.  Within the MySQL prompt, create the database by running `CREATE DATABASE restaurantsDB;`
7.  Exit MySQL prompt by running `EXIT;`
8.  Navigate to the project directory, then to `/server`
9.  Run `mysql -u [your_mysql_username] -p[your_password] restaurantsDB < schema.sql`
    (Note there should be no space between -p and [your_password])
    (By default username will be root and password will be empty so you can run `mysql -u root -p restaurantsDB < schema.sql`) and hit enter if prompted for a password)

### Start running the server:

1.  Navigate to `/JUSTEAT/server` in terminal
2.  Run `node server.js`

### Using the web app:

1.  Open `/web_page/views/indexView.html` in Google Chrome
2.  Search using any UK postcode
3.  Select a filter from the filter drop down menu in the center to restrict results to those of that cuisine type
4.  Click on the arrow keys in the top right to show more results
5.  Click on a listing to view a map of the restaurant and see it's details alone



## DESIGN

Despite having direct access to the JET API, due to how frequently the data needs to be accessed, a database was implemented. This has 2 main advantages:

- The database acts as a "cache" of the API, so the API doesn't need to constantly be called
- Storing the data in a database makes using it at different times easier, accross multiple html pages and scripts

The flow of the application when needing data is typically as follows:

`view` -> `view script` -> `server` -> `database handler` -> `database`
followed by the reverse
`database` -> `database handler` -> `server` -> `view script` -> `view`


## IMPROVEMENTS TO MAKE

- Adjust the way HTML elements are styled by better making use of percentages and calculations, to allow for consistent sizing
- Have the filters be dynamic based on the cuisines that are within the returned restaurants
- restaurantInfoView.html design
  > Add icons for all cuisines
  > Add stars icons to indicate the rating
  > Make previous and next listings in the carousel show smaller and faded on the sides



## KNOWN BUGS / PROBLEMS

- When applying a filter, only that cuisine displays under each restaurant listing
  > This is due to the response from the database query and should be a relatively simple fix
- After applying a filter and selecting a restaurant, the navigation buttons still work on the originally searched data set
  > This is due to the restaurantInfoScript.js re-querying the database without the filter
  > Initially, before filters were added, this was done so that the entire restaurantData list doesn't need to be passed in the URL
  > The intended fix for this is to add a "cuisine" flag when the restaurantInfoView.html is shown, that calls the correct database query



## NOTES

- There are inconsistencies in the implementation of the display because:
  > I am relatively new to front-end and was experimenting with different methods of achieving the effect I wanted
  > I progressively started to get more comfortable with certain techniques and thus used them more
- I used the JET website and delivery apps as inspiration, but all of the css and html was made myself, I did not copy from the sites
