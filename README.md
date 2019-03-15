# MSc. Thesis - PhotoCube Client and Server implementations.
## Prerequisites:
On a Windows PC:

Tip: Hold ctrl when clicking on the links to open them in a new tab:
* Download and install [Visual Studio IDE (Community edition is free)](https://visualstudio.microsoft.com/vs/) (Required for running and developing server).
* Download and install [Visual Studio Code IDE](https://code.visualstudio.com/) (Recommended for client development).
* Download and install [Node](https://nodejs.org/en/) (Required for React client).
* Download and install [SQL Server (Express and Developer editions are free)](https://www.microsoft.com/en-us/sql-server/sql-server-2017-editions#CP_StickyNav_1) (Required for running development server) **REMEMBER TO CHECK LOCALDB DURING INSTALLATION**.

Please restart your computer after installing the frameworks, before trying out the code.

## Download the code:
Either clone this repository or download it as a zip file with the green button on the top-right of this page.

## Download the dataset:
Link to zip file on OneDrive containing the Laugavegur dataset:
https://1drv.ms/f/s!AuZm-4W16RlCgrZlsehbzvQvM4kq5w

## Installing and running the server:
### Step 0: Open the ObjectCubeServer solution file in Visual Studio:
Open the *ObjectCubeServer.sln* solution file in Visual Studio. This can be found in the *ObjectCubeServerNetCore2/ObjectCubeServer/* directory.

If Visual Studio says that you need to download and install extensions to make it work, please do so.

### Step 1: Enter a connection-string:

Add a connection-string to your SQL database in the file: *ObjectCubeServer/Models/Contexts/ObjectContext.cs* around line 124. Eg:
```
  case "DESKTOP-EO6T94J": //Laptop
    optionsBuilder.UseSqlServer("Server = (localdb)\\mssqllocaldb; Database = ObjectData; Trusted_Connection = True; AttachDbFileName=C:\\Databases\\ObjectDB.mdf");
    break;
```
Note that you can find your computername Eg. "DESKTOP-EO6T94J" by running the command *hostname* in cmd.

Also note that the connection-string identifies the Server, this is usually "Server = (localdb)\\mssqllocaldb;", the name of the database: "Database = ObjectData;", that it's a trusted connection: "Trusted_Connection = True;" and the path to the database file (.mdf) "AttachDbFileName=C:\\Databases\\ObjectDB.mdf". The ObjectDB.mdf file will be created later with the command "Update-Database".

Also note that the directory *C:\\Databases* needs to exist.

### Step 2: Enter the path to the Laugavegur Dataset on your computer:
Please specify the path to the Laugavegur dataset on your computer in *ConsoleAppForInteractingWithDatabase/LaugavegurDatasetInserter.cs* around line 34. Eg:
```
  case "DESKTOP-EO6T94J": //Laptop
    pathToDataset = @"C:\LaugavegurData";
    break;
```

### Step 3: Rebuild the solution to download missing NuGet packages
Then we will compile the applications by right-clicking the Solution in the Solution Explorer and click *Rebuild Solution*. This will download and install all the NuGet packages needed:

![Rebuild%20solution.png](https://github.com/PeterOeClausen/Thesis/blob/master/userManualImages/InstallationManualImages/Rebuild%20solution.png)

### Step 4: Create the database schema migrations and run the migrations against the server:
If the folder *Migrations* exists in the ObjectCubeServer project, please right-click and delete it. We will generate it again next:

Open the Package Manager Console (tip: You can search for it in the upper right corner):

![PackageManagerConsole.png](https://github.com/PeterOeClausen/Thesis/blob/master/userManualImages/InstallationManualImages/PackageManagerConsole.png)

Be sure that Default Project is set to ObjectCubeServer, and that ObjectCubeServer is selected as StartUp Project:

![ObjectCubeServerDefaultProject.png](https://github.com/PeterOeClausen/Thesis/blob/master/userManualImages/InstallationManualImages/ObjectCubeServerDefaultProject.png)

Run:
```
Add-Migration init
```
To create the Migrations folder.

Then run:
```
Update-Database
```
To apply the migration to the database. This will create the database on the server.

### Step 5: Populate the server with data:

To populate the database with data, right-click the ConsoleAppForInteractingWithDatabase and select 'Set as StartUp Project'.
Then run the application by pressing the *Play* button in the top of Visual Studio to start the ConsoleAppForInteractingWithDatabase program:

![RunConsoleAppForInteractingWithDatabase.png](https://github.com/PeterOeClausen/Thesis/blob/master/userManualImages/InstallationManualImages/RunConsoleAppForInteractingWithDatabase.png)

When the Console Application says "Press any key to shut down." the database is populated. This process usually takes around 20-30 minutes.

### Step 6: Run the server:

You can now run the server by right-clicking the ObjectServer project, select 'Set as StartUp Project' and then run the application by pressing the play button in the top of Visual Studio.

## Installing and running the client:
Note that when running these commands, it may give "WARN" and "notice" messages, however you can ignore these and keep going with the installation.

### Step 1: Install React:
Be sure that you have installed React:
```
npm install react
```
### Step 2: Install the project:
Navigate to the *photo-cube-client-react/* directory and run:
```
npm install
```
This will download and install all required packages.

Tip: You can start the cmd in the current directory if you write "cmd" and press enter in FileExplorer, though this might not work in a simulated environment, then you may have to use "d:" to change to the d drive, and then "cd {yourPath}":

![OpenCmdInCurrentPath.png](https://github.com/PeterOeClausen/Thesis/blob/master/userManualImages/InstallationManualImages/OpenCmdInCurrentPath.png)

### Step 3: Run the client:
Run the client with the command:
```
npm start
```
A browser tab should open automatically with the client application.

## User manual:
When the client and server is running, you can choose dimensions on the right, picking either tagsets or hierarchies:
![PickingDimension.png](https://github.com/PeterOeClausen/Thesis/blob/master/userManualImages/PickingDimension.png)

Press f11 to use the PhotoCube Browser full-screen and escape to exit full-screen.

After picking a hierarchy, you can drill down into the hierarchy on the right:

![DrillingDown.png](https://github.com/PeterOeClausen/Thesis/blob/master/userManualImages/DrillingDown.png)

Rotate the camera by left-clicking and dragging. Pan the camera by right-clicking and dragging. Zoom in and out using the scroll wheel. Move the camera in y direction using space-key for up or ctrl-key for down.

You can also hover over a cube with the mouse, and see how many photos are in the cube and see what tags it is alligned with:

![MouseOverCube.png](https://github.com/PeterOeClausen/Thesis/blob/master/userManualImages/MouseOverCube.png)

You can swich browsing mode on the right side to from Cube to Grid or Card mode. Press escape to return to the cube mode you were in:

![ChangingBrowsingMode.png](https://github.com/PeterOeClausen/Thesis/blob/master/userManualImages/ChangingBrowsingMode.png)

**Card browsing mode:**

![CardMode.png](https://github.com/PeterOeClausen/Thesis/blob/master/userManualImages/CardMode.png)

**Grid browsing mode:**

![GridMode.png](https://github.com/PeterOeClausen/Thesis/blob/master/userManualImages/GridMode.png)

You can also right click a cube and press "Show cube in card mode" to open a cube in card-mode:

![RightClickOpenCardMode.png](https://github.com/PeterOeClausen/Thesis/blob/master/userManualImages/RightClickOpenCardMode.png)

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
