<!-- PROJECT SHIELDS -->
[![Build Status][build-shield]]()
[![Contributors][contributors-shield]]()
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/CDH-Studio/Jarvis">
    <img src="public/logo_full_dark.png" alt="Logo" width="40%" height="auto">
  </a>
  <p align="center">
     A CDH Studio Room Booking Application
    <br />
    <a href="https://github.com/othneildrew/Best-README-Template"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/CDH-Studio/Jarvis/">Demo</a>
    ·
    <a href="https://cdh-studio.github.io/Jarvis-Demo-Website">Website/ Screenshots</a>
    ·
    <a href="https://github.com/CDH-Studio/Jarvis/wiki">View Wiki</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Screenshots](#screenshots)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)



<!-- ABOUT THE PROJECT -->
## About The Project

Jarvis is a simplified room booking application that provides a solution to the issues currently present at ISED, namely a complicated and time consuming room booking process. Jarvis works on top of the current Outlook system and is designed to save employees time, money, and increase productivity. Main features include: 
* The ability to view and book available rooms
* Detailed information about rooms including images, available equipment, and more!
* Manage bookings
* A review system
* Reporting system
* Outlook integration

Jarvis provides an integrated administrator dashboard, where admins will have the ability to access and utilize room and user statistics to allow ISED to make smarter investment decisions. In addition, Jarvis allows administrators to add additional rooms, edit existing room details and statuses, manage users, bookings, and existing issues.


Developed by the Winter 2019 students at CDH Studio, this application is currently in it’s beta. Any questions, suggestions, and bugs should be directed to Yunwei Li or Ali Nouri at (cdhstudio.jarvis@gmail.com)

### The Team

* [Ali Nouri - Technical Lead/Mentor](https://www.linkedin.com/in/a-nouri/)
* [Majd Khodr - Full-stack Developer](https://www.linkedin.com/in/majd-khodr-6aa383152/)
* [Peter Lam - Full-stack Developer](https://www.linkedin.com/in/peter-lam-612a00138/)
* [Yunwei Li - Full-stack Developer](https://www.linkedin.com/in/yunwei-li-b27667106/)


### Built With

* [AdonisJs](https://adonisjs.com)
* [Bootstrap](https://getbootstrap.com)
* [JQuery](https://jquery.com)
* [SQLite3](https://www.sqlite.org)
* [OpenShift](https://www.openshift.com)

<!-- GETTING STARTED -->
## Prerequisites

To get a local copy up and running follow these simple example steps.

### Install virtual environment 
The commands provided beyond this point are linux based. The preferred local environment is a **ubuntu 18.04 LTS virtual machine**.

Follow the steps below to install the virtual machine:

1. Download and install Virtual Box from the following link. Last tested version: 6.0

    [Oracle Virtual Box](https://www.virtualbox.org/ "Oracle Virtual Box")

2. Download the VM image (VirtualBox Appliance) and load into Virtual box

    ** link to ubuntu image configured with proxy by Ali here **

    **NOTE:** Please read the README file included in the zip to find the password for image

3. Boot up the VM and test you have network connection. **If you are having issue it is often related to proxy settings**

4. If you are having problems with screen resolution and clipboard sharing between Guest and Host OS then please install the **Ubuntu Guest additions**:

    1.
        `$ sudo apt update`<br/>
        `$ sudo apt upgrade`<br/>
        `$ sudo apt install build-essential dkms linux-headers-$(uname -r)`

    2. Next, from the Virtual Machine menu bar, go to Devices => click on Insert Guest Additions CD image as shown in the screenshot. This helps to mount the Guest Additions ISO file inside your virtual machine.

    3. Next, you will get a dialog window, prompting you to Run the installer to launch it.

    4. A terminal window will be opened from which the actual installation of VirtualBox Guest Additions will be performed. Once the installation is complete, press [Enter] to close the installer terminal window. Then power off your Ubuntu guest OS to change some settings from VirtualBox manager as explained in the next step.

### Install Dev tools
inside the VM you can now install your dev tools. we rommend:
1. Git
2. Visual studio Code

**PLEASE NOTE:** The proxy setting of Git might have to be configured manually if it int picked up  automatically form the system settings.

### Install Docker & Docker Composer
We use docker within the VM to further standardize the dev environment.
You can run docker in windows if you get correct permissions from IT support but for consistency of environment we recommend using the VM provided above.

<strong>Install Docker</strong><br/>
`$ sudo apt-get update` <br/>
`$ sudo apt-get install docker-ce docker-ce-cli containerd.io`

<strong>Install Docker Compose</strong><br/>
Run this command to download the current stable release of Docker Compose: <br/>
`$ sudo curl -L "https://github.com/docker/compose/releases/download/1.25.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose` <br/>

Apply executable permissions to the binary:<br/>
`$ sudo chmod +x /usr/local/bin/docker-compose`

<strong>Configure Docker Proxy Settings</strong><br/>
Create a systemd drop-in directory: <br/>
`$sudo mkdir /etc/systemd/system/docker.service.d` <br/>

open config file <br/>
`sudo gedit /etc/systemd/system/docker.service.d/`<br/>

copy the following code into the file:
```
[Service]
Environment="HTTP_PROXY=https://http://cdhwg01.prod.prv:80/"
Environment="HTTPS_PROXY=https://http://cdhwg01.prod.prv:80/"
Environment="NO_PROXY=localhost,127.0.0.1,localaddress,0.0.0.0"
```
flush changes
`$ sudo systemctl daemon-reload` <br/>

Verify that the configuration has been loaded:<br/>
`$ sudo systemctl show --property Environment docker` <br/>
**Output should be:** "Environment=HTTP_PROXY=http://cdhwg01.prod.prv:80/"<br/>

Restart Docker<br/>
`$ sudo systemctl restart docker` <br/>

## Run Application Container

To run the application for local environment `cd` in to your project directory inside the virtual machine and run.

`docker-compose up`

The application is now served at the following address

`http://0.0.0.0:3333/`

## Shutdown Application Container

To shutdown the application for local environment `cd` in to your project directory inside the virtual machine and run.

`docker-compose down`

## Migration and Seeding

All testing databases should automatically migrate and seed When spinning up the application using `docker-compose`. In the event that it doesn't please follow the following steps.

### Run Database Migrations

To run the database migrations you much attach your terminal to the container shell. This can be done by either right clicking on the container named "jarvis_web" in VS Code and selecting "attach shell" in the drop down or running the following command:

`docker exec -it <mycontainerid> bash`

Once the shell has attached to the container you can run to begin the migration.

`adonis migration:done`

Every time you shutdown the application container you will have to run the migration again.

### Run Database Seeding

Seeding will fill you DB with some valid dummy data. 

To run the database seeding you much attach your terminal to the container shell. This can be done by either right clicking on the container named "jarvis_web" in VS Code and selecting "attach shell" in the drop down or running the following command:

`docker exec -it <mycontainerid> bash`

Once the shell has attached to the container you can run to begin the migration.

`adonis seed`

## See Into Database

One of the containers running alongside jarvis is called `adminer`. This container serves a tool that allows us to see the contents of the DB. To go to the tool you can visit the following address in your browser. 

*please note: you should have already ran docker-compose up for this to work* 

`http://0.0.0.0:8080/`

You can now use the credential you defined in the .env file to log in as seen in the following image.

<img src="screenshots/adminer-login.png" alt="Logo" width="40%" height="auto">

## ESLint

In order to successfully merge pull requests you must run ESLint on your project before opening PR.

Step 1: cd into project directory in VM

Step 2: install ESLint globally

`npm i -g eslint`

Step 3: run ESLint

Run eslint using the --fix flag to automatically fix as much as it can. Please manually correct any errors that it print out.

`eslint . --fix`

************************
*please ignore beyond this point*

### Other Prerequisites

Install the following in your local environment:

* Install Node.js [here](https://nodejs.org/en/download/)

* Install Adonis with `yarn add global @adonisjs/cli`

* To setup SQLite3, Outlook, and more check out our [wiki](https://github.com/CDH-Studio/Jarvis/wiki/Set-Up)

### Installation

1. Clone the Jarvis [repo](https://github.com/CDH-Studio/Jarvis)
2. Set up the .env file based on .env.example
3. Run 'docker-compose up"
4. Go to `http://0.0.0.0:3333/` in the virtual machine browser

<!-- USAGE EXAMPLES -->
## Screenshots

![screenshot1]
![screenshot2]
![screenshot3]

_For more examples, please refer to the [Documentation](https://github.com/CDH-Studio/Jarvis/wiki)_


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->
## Contact

* [CDH Studio Website](https://cdhstudio.ca/)
* cdhstudio.jarvis@gmail.com

Project Link: [https://github.com/CDH-Studio/Jarvis](https://github.com/CDH-Studio/Jarvis)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements

* [Img Shields](https://shields.io)
* [Font Awesome](https://fontawesome.com)
* [Google Fonts](https://fonts.google.com)
* [Animate.css](https://daneden.github.io/animate.css)
* [Moment.js](https://momentjs.com)
* [Chart.js](https://www.chartjs.org)

<!-- MARKDOWN LINKS & IMAGES -->
[build-shield]: https://img.shields.io/circleci/project/github/CDH-Studio/Jarvis.svg
[contributors-shield]: https://img.shields.io/badge/contributors-4-orange.svg?style=flat-square
[license-shield]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license-url]: https://choosealicense.com/licenses/mit
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: https://github.com/CDH-Studio/Jarvis/blob/CDHJ-00-Feature/ReadME/screenshots/JarvisRegistration.png
[screenshot1]: https://github.com/CDH-Studio/Jarvis/blob/CDHJ-00-Feature/ReadME/screenshots/AdminDash.png
[screenshot2]: https://github.com/CDH-Studio/Jarvis/blob/CDHJ-00-Feature/ReadME/screenshots/UserLanding.png
[screenshot3]: https://github.com/CDH-Studio/Jarvis/blob/CDHJ-00-Feature/ReadME/screenshots/RoomDetails.png