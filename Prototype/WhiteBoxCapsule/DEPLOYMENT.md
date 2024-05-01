# Deployment: How To

## Frontend
- Run ``npm run build`` to build the frontend
- On Filezilla, go to 'Gamflew' site.
- Pass the contents of the 'dist' folder inside the 'public_html' folder.
- Done!

Be sure to check the code that is being deployed, and make sure it is the correct version.

## Backend
- Pass everything inside the 'backend' folder to the server, using Filezilla, to 'GamflewAPI' site.
- Use the VPN and connect using ssh: ``ssh root@gamflew-api.fe.up.pt``
- Go to the folder where the backend is located: ``cd backend``
- Use nohup to run the backend in the background: ``nohup python3.12 -m main &``
- Do ```CTRL + D`` to safely close the ssh connection.
- Done!

Be sure to check that the API (https://gamflew-api.fe.up.pt:8000/) is running and the frontend can connect.


It's necessary to use the VPN to connect to the API, for now.