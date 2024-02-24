# Monitra-Healthcare-Internship

## About Monitra Healthcare 🏢 : 
Monitra Healthcare started with a fundamental premise that healthcare monitoring should not be cumbersome for patients. As a team of passionate individuals on a mission to help clinicians in early accurate diagnosis of medical conditions with simple cutting-edge innovations, Monitra Health seeks to address the world's pressing health problems using medical data driven insights to shape healthcare delivery. 

## Product UpBeat : 
Helps clinicians diagnose two most difficult problems in clinical cardiology - unexplained fainting and palpitations. 
It is a wearable medical grade biosensing skin patch that continuously 24*7 captures electrocardiogram (ECG) and tracks posture as well as activities in real-time. This physiological data is transmitted continuously to the phone and the information is relayed to the cloud platform upBeat.AI. 
The dashboard allows for structured efficient review of entire data and generation of reports. 

## My project 💻: 
Developing a live ECG Graph feature by collecting real-time data from patients wearing an implanted device and plot their ECG Graph on grid paper live. This feature allowed doctors to monitor their patient's heart activity and make timely observations. 
### Feature requirements : 
- Graph performance : smooth on mobile and desktop devices
- Scalable Graph
- Responsive Design
- Background ECG Grid - Speed (25mm/sec) and Amplitude (10mm/mV)
- Reactivity
- Dynamic Rendering
- Continuous Data Collection - gather fresh data at regular intervals
- Time axis (timestamps)
- Customisable Display Options
- Data export and Storage Support in common formats
- User friendly interface

  ### Development process :
  - Retriveing the data - API creation and use
  - VueJS usage
  - Data Export in CSV format
  - Array Manipulation
  - Responsive Design using media queries
  - Canvas Creation
  - D3Js library for data scaling and visualisation
  - Grid lines and caching
  - The mega find - requestAnimationFrame functionality
  - Challenging part of the project - Looping the graph
  - Timestamp updation
  - The batching mechanism
  - Validation :
    A sin (2*pi*f*t)
    Heart rate = 60 rates per minute
    Frequency = 60/60 = 1
    Sampling Rate = 200
    A = 1
    Creation of 1mV signal should pass through 4 boxes
  - Deployment of feature in portal
