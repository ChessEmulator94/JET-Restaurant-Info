# JET Restaurant Finder @README

## SETUP

### Create the DB Schema (Mac):

1.  Install mysql using `brew install mysql` and set up a username and password
2.  Navigate to `/JUSTEAT/server` in terminal
3.  Run `mysql -u [your_mysql_username] -p[your_password] restaurantsDB < schema.sql`
    (Note there should be no space between -p and [your_password])

### Start running the server:

1.  Navigate to `/JUSTEAT/server` in terminal
2.  Run `node server.js`

### Using the web app:

1.  Open `JUSTEAT/web_page/views/indexView.html` in Google Chrome

## DESIGN

Despite having access directly to the JET API, due to how frequently the data needs to be access a database was implemented. This has 2 main positives:

- The database acts as a "cache" of the API, so the API doesn't need to constantly be called when working with the same postcode
- Storing the data in a database makes using it at different times easier accross multiple pages and functions

The flow of the application is typically as follows:

`view` -> `view script` -> `server` -> `database handler` -> `database`
followed by the reverse
`database` -> `database handler` -> `server` -> `view script` -> `view`

## NOTES

- There are inconsistencies in the implementaion of the display because:
  > I am relatively new to front-end and was experimenting with different methods of achieving the effect I wanted
  > I progressively started to get more comfortable with certain techniques and thus used them more
- I used the JET website and delivery apps as inspiration, but all of the css and html was made myself, I did not copy from the sites
