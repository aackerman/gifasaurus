* Add file logging as console.log is syncronous
* Tests file formats other than .mov
* Compile / Copy assets into the public folder for distribution
* Handle timeout if the image takes possibly longer than 30s to convert
* Handle styling the content
* Use sessions to manage users viewing files that have already been uploaded
* Create route for allowing a user to let us know they would pay for the service
* Review 5minfork and look at handling deleting images, and uploaded videos after a period of time

## Deployment Tasks

* Install nginx
* Setup reverse proxy to node
* Serve static compressed gif files
* Serve other public assets
* Serve 404.gif for images that don't exist

## Technology Choices
* Express - based on ease of use only
* Ember - based on interest and client-side only rendering
