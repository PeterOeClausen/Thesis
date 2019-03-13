# MSc. Thesis - PhotoCube Client and Server implementations.
## Prerequisites:
* On a Windows PC:
* Download and install [Visual Studio](http://google.com) (Required for running and developing server).
* Download and install [VS Code](https://code.visualstudio.com/) (Recommended for client development).
* Download and install [Node](https://nodejs.org/en/) (Required for React client).
* Download and install [SQL Server (Express and Developer editions are free)](https://www.microsoft.com/en-us/sql-server/sql-server-2017-editions#CP_StickyNav_1) (Required for running development server) **REMEMBER TO CHECK LOCALDB DURING INSTALLATION**.
* Remember to restart your computer after installing the frameworks, before trying out the code.

## Download the code:
Either clone this repository or download it as a zip file with the green button on the top-right of this page.

## Download the dataset:
Link to zip file on OneDrive containing the Laugavegur dataset:
https://1drv.ms/f/s!AuZm-4W16RlCgrZlsehbzvQvM4kq5w

## Installing and running the client:
Be sure that you have installed React:
```
npm install react
```
Navigate to the *photo-cube-client-react/* directory and run:
```
npm install
```
This will download and install all required packages.
Then, run the client with the command:
```
npm start
```
To start the application. A browser tab should open automatically with the client application.

## Installing and running the server:
Be sure that you have SQL Server running.

Open the *ObjectCubeServer.sln* solution file in Visual Studio. This can be found in the *ObjectCubeServerNetCore2/ObjectCubeServer/* directory.

First we need to specify some paths:

Add a connection-string to your SQL database in the file: *ObjectCubeServer/Models/Contexts/ObjectContext.cs* around line 124. Eg:
```
  case "DESKTOP-EO6T94J": //Laptop
    optionsBuilder.UseSqlServer("Server = (localdb)\\mssqllocaldb; Database = ObjectData; Trusted_Connection = True; AttachDbFileName=C:\\Databases\\ObjectDB.mdf");
    break;
```
Note that the connectionstring identifies the Server, this is usually "Server = (localdb)\\mssqllocaldb;", the name of the database: "Database = ObjectData;", that it's a trusted connection: "Trusted_Connection = True;" and the path to the database file (.mdf) "AttachDbFileName=C:\\Databases\\ObjectDB.mdf". The ObjectDB.mdf file will be created later with the command "Update-Database".

Also, you need to specify the path to the Laugavegur dataset on your computer in *ConsoleAppForInteractingWithDatabase/LaugavegurDatasetInserter.cs* around line 34. Eg:
```
  case "DESKTOP-EO6T94J": //Laptop
    pathToDataset = @"C:\LaugavegurData";
    break;
```

Then we will compile the applications by right-clicking the Solution in the Solution Explorer and click *Rebuild Solution*. This will download and install all the NuGet packages needed.

Next, we want to create the database schema:
To be sure, if a folder named *Migrations* exist in the ObjectCubeServer project, right-click it and press delete.

To generate it again, open the Package Manager Console (tip: You can search for it in the upper right corner).
Be sure that Default Project is set to ObjectCubeServer, and that ObjectCubeServer is selected as StartUp Project.
Run:
```
Add-Migration init
```
To create the migrations directory if not present in the solution.

Then run:
```
Update-Database
```
To apply the migration to the database. This will create the database.

To populate the database with data, right-click the ConsoleAppForInteractingWithDatabase and select 'Set as StartUp Project'.
Then run the application by pressing the *Play* button in the top of Visual Studio.
When the Console Application says "Press any key to shut down." the database is populated. This process usually takes around 20-30 minutes.

You can now run the server by right-clicking the ObjectServer project, select 'Set as StartUp Project' and then run the application by pressing the play button in the top of Visual Studio.

## Other (needed if you are going to make changes to the database or downloaded npm packages on a seperate computer):
If you need to delete the data in the database, run:
```
Drop-Database
```
in the package manager console. This will delete the database.

If you have made changes to the DB Schema, I recommend deleting the *Migrations* directory, running 'Drop-Database' followed by
```
Add-Migration init
```
in the Package Manager Console. This will recreate the Migrations directory and create the Migrations.
Lastly, update the schema by running 'Update-Database'.

You can apply changes to the database schema with the command:
```
Update-Database
```

If you have worked on the client application on one computer, and installed packages using npm, install these packages by running 'npm install' before running 'npm start'.
