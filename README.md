# Msc. Thesis - PhotoCube client and Server.
## Prerequisites:
* Download and install [Node](https://nodejs.org/en/) (Required for React client).
* Download and install [Visual Studio](http://google.com) (Required for running and developing server).
* Download and install [SQL Server Management Studio](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-2017#ssms-180-preview-6) (Required for running development server).
* Download and install [SQL Server (Express and Developer editions are free)](https://www.microsoft.com/en-us/sql-server/sql-server-2017-editions#CP_StickyNav_1) (Required for running development server)

## Installing and running the client:
Be sure that you have installed React:
```
npm install react
```
Navigate to the '/photo-cube-client-react/' directory and run:
```
npm install
```
This will download and install all required packages.
Then, run the client with the command:
```
npm start
```
A browser tab should open automatically with the client application.

## Installing and running the server:
Be sure that you have SQL Server running.

Open the 'ObjectCubeServer.sln' solution file in Visual Studio. This can be found in the './ObjectCubeServerNetCore2/ObjectCubeServer/' directory.

Right-click the Solution in the Solution Explorer and click 'Rebuild Solution'. This will download all the NuGet packages needed.

Next, we want to create the database schema:
Open the Package Manager Console (tip: You can search for it in the upper right corner).
Be sure that Default Project is set to ObjectCubeServer, and that ObjectCubeServer is selected as StartUp Project.
Run:
```
Update-Database
```
This will create the database schema.

To populate the database, right-click the ConsoleAppForInteractingWithDatabase and select 'Set as StartUp Project'.
Then run the application by pressing the "Play" button in the top of Visual Studio.
When the Console Application says "Press any key to shut down." the database is populated. This process takes around 20-30 minutes.

You can now run the server by right-clicking the ObjectServer project, select 'Set as StartUp Project' and then run the application by pressing the play button in the top of Visual Studio.

## Other:
If you need to delete the data in the database, run
```
Drop-Database
```
in the package manager console, followed by:
```
Update-Database
```

If you have made changes to the DB Schema, I recommend deleting the Migrations directory, running 'Drop-Database' followed by
```
Add-Migration init
```
in the Package Manager Console. This will recreate the Migrations directory and create the Migrations.
Lastly, update the schema by running 'Update-Database'.

If you have worked on the client application on one computer, and installed packages using npm, install these packages by running 'npm install' before running 'npm start'.
