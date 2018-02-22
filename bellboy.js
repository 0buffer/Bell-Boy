// Copyright (c) 2017 Peter Budd. All rights reserved
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
// associated documentation files (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//     * The above copyright notice and this permission notice shall be included in all copies or substantial
//       portions of the Software.
//     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
//       BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
//       IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
//       WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
//       SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. THE AUTHORS AND COPYRIGHT HOLDERS, HOWEVER,
//       ACCEPT LIABILITY FOR DEATH OR PERSONAL INJURY CAUSED BY NEGLIGENCE AND FOR ALL MATTERS LIABILITY
//       FOR WHICH MAY NOT BE LAWFULLY LIMITED OR EXCLUDED UNDER ENGLISH LAW

// This script forms part of the Bell-Boy project to measure the force applied by a bell ringer to a tower
// bell rope.  The Bell-Boy uses tangential acceleration of the bell as a proxy for force applied.  The
// hardware is currently a Pi Zero running Arch Linux.

// I pulled snippets of code from loads of places so if any of you recognise anything you wrote - thanks!

// The script below is the javascript for the front end.  It makes extensive use of HTML5 canvases
// so HTML5 is required.  Websockets are also used to pull data from the Bell-Boy device.


var BGCOLOUR="#686888";

var nonLive=false;
var wsHost="10.0.0.1"

var sampleInterval = 5.0;  // milliseconds for each sample (default 200 times/sec).  Updated by SAMP: command
var collectInterval = 50.0; // update display in ms - here 20 times/sec

var canvasBD = document.getElementById("canvasBD");
var ctxBD = canvasBD.getContext("2d");

var canvasBDt= document.getElementById("canvasBDt");
var ctxBDt = canvasBDt.getContext("2d");

var posBS2 = 0; // position on canvas of BS2
var posHS1 = 0;
var posHS2 = 0;
var posBS1 = 0;
var posCB = 0;  // position on canvas of bell (and timers)
var CBwidth = 64; // width of bell on canvas
var BDwidth = 0; // width of individual stroke sections on canvas
var radius = 0;

var strokeTimer=0; // used for time displays under animated bell

var canvasAT=document.getElementById("canvasAT");
var ctxAT=canvasAT.getContext("2d");
var canvasATt=document.getElementById("canvasATt");
var ctxATt=canvasATt.getContext("2d");

var currentATmargin = 0;
var currentATpixels = 1;
var ATbottomMargin=20; // pixels at bottom of AT canvas for indexes

var oldBellAngle = 0;
var wsOpened = false;

var scaleValue = 0.0;

var ROIRanges = [[-20,90],[-20,70],[-10,60],[-10,50],[-10,40],[-10,30]];
var currentROI=3;
var ROIU = ROIRanges[currentROI][0];
var ROIL = ROIRanges[currentROI][1];

var playbackRanges = [200, 150, 100, 80, 50, 30, 10]; // available playback speeds (percent)

var currentPlaybackSpeed = 2;
var targets = [ "none", "-10", "-7", "-5", "-2" , "0", "2", "5", "7" , "10" ]; // these are target balance angles
var scales = [ 2000, 1000, 700, 500, 300, 200 ];

var currentPlaybackPosition = 1;
var playintervalID = null;
var statusintervalID = null;
var liveintervalID = null;


var currentStatus = 0;
var DOWNLOADINGFILE=1;
var RECORDINGSESSION=2;
var SESSIONLOADED=4;
var FAVOURITEDISPLAYED=8;
var PLAYBACK=16;
var LASTHS1=32;
var LASTHS2=64;
var LASTBS1=128;
var LASTBS2=256;
var HELPDISPLAYED=512;
var PAUSED=1024;
// var GRIDLINESDISPLAYED=2048;
var LIVEVIEW=4096;
var ABORTFLAG = 8192;

var targetAngleHand=null;
var targetAngleBack=null;

var calibrationValue=null;

var currentSwingDisplayed=null;
var sample = [];
var swingStarts = [];
var halfSwingStarts=[];
var template = [];

ws = new WebSocket("ws://" + wsHost);

////////////////////////////////////////////////////////////////
//                SETUP SELECT BOX FUNCTIONS                  //
////////////////////////////////////////////////////////////////

document.getElementById("targetSelectHand").options.length = 0;
document.getElementById("targetSelectBack").options.length = 0;
for (var i=0; i < targets.length; i++) {
    var option = document.createElement("option");
    option.text=targets[i];
    document.getElementById("targetSelectHand").add(option);
    option = document.createElement("option");
    option.text=targets[i];
    document.getElementById("targetSelectBack").add(option);
}

document.getElementById("zoomSelect").options.length = 0;
for (var i=0; i < ROIRanges.length; i++) {
    var option = document.createElement("option");
    option.text=ROIRanges[i][0].toString() + " to " + ROIRanges[i][1].toString()
    document.getElementById("zoomSelect").add(option);
}
document.getElementById("zoomSelect").selectedIndex = currentROI.toString();

document.getElementById("speedSelect").options.length = 0;
for (var i=0; i < playbackRanges.length; i++) {
    var option = document.createElement("option");
    option.text=playbackRanges[i].toString() + "%"
    document.getElementById("speedSelect").add(option);
}
document.getElementById("speedSelect").selectedIndex = currentPlaybackSpeed;

document.getElementById("scaleSelect").options.length = 0;
for (var i=0; i < scales.length; i++) {
    var option = document.createElement("option");
    option.text=scales[i].toString()
    document.getElementById("scaleSelect").add(option);
}
document.getElementById("scaleSelect").selectedIndex = 4;  // start at 300
scaleValue=parseFloat(scales[document.getElementById("scaleSelect").selectedIndex])

////////////////////////////////////////////////////////////////
//                 WEBSOCKET HANDLER FUNCTIONS                //
////////////////////////////////////////////////////////////////

ws.onopen = function(){
    wsOpened=true;
    setStatus("Link open");
    document.getElementById("openSelect").options.length = 0;
    ws.send("FILE:");
    var d = new Date();
    ws.send("DATE:" + parseInt(d.getTime()/1000));
    if (!nonLive) ws.send("SAMP:");
    
};

ws.onmessage = function (event) {
    var dataBack = event.data.split("\n");
    for (var i=0; i<dataBack.length; i++) {
        if (dataBack[i].length > 3) parseResult(dataBack[i]);
    }
}

function parseResult(dataBack) {
    if (dataBack.slice(0,5) == "FILE:"){
        var option = document.createElement("option");
        option.text=dataBack.slice(5);
        document.getElementById("openSelect").add(option);
        return;
    }
    if (dataBack.slice(0,5) == "DATA:"){
        var sampArray = dataBack.split("DATA:");
        var arrayLength = sampArray.length;
        var added = 0;
        var extracted = [];
        for (var i = 0; i < arrayLength; i++) {
            if (sampArray[i].length > 20) {   // have more checks for good data (sampArray[i].split[","].length >=3)
                sample[sample.length] = extractData(sampArray[i]);    
                added+=1;
            }
        }
        setStatus("Loaded: " + added.toString() + " samples. Now Have: " + sample.length.toString());
        return;
    }
    
    if (dataBack.slice(0,5) == "LIVE:"){
        if ((currentStatus & LIVEVIEW) == 0 && (currentStatus & RECORDINGSESSION) == 0) { return; }  // server may push data after stopping
        var sampArray = dataBack.split("LIVE:");
        var arrayLength = sampArray.length;
        for (var i = 0; i < arrayLength; i++) {
            if (sampArray[i].length > 20) {   // have more checks for good data (sampArray[i].split[","].length >=3)
                sample[sample.length] = extractData(sampArray[i]);    
            }
        }
        return;
    }

    if ((dataBack.slice(0,5) == "LFIN:") || (dataBack.slice(0,5) == "STPD:")) {
        if ((currentStatus & DOWNLOADINGFILE) !=0){
            currentStatus &= ~DOWNLOADINGFILE;
        } else if ((currentStatus & LIVEVIEW) !=0) {
            currentStatus &= ~LIVEVIEW;
        } else if ((currentStatus & RECORDINGSESSION) !=0) {
            currentStatus &= ~RECORDINGSESSION;
        }
        if ((currentStatus & ABORTFLAG) !=0) {
            currentStatus &= ~ABORTFLAG;
            sample = [];
            swingStarts=[];
            currentPlaybackPosition = 1;
            currentSwingDisplayed = null;
            return;
        }
        currentStatus |= SESSIONLOADED;
        updateIcons();
        swingStarts=[];
        halfSwingStarts=[];
//        swingStarts[0] = 3; // ditch first couple of samples - could be 1 but meh
        currentPlaybackPosition = 1;
        currentSwingDisplayed = null;
        var i = null, j=null , k=null;
        var arrayLength=sample.length;

//        while (i < arrayLength && sample[i][0] < 180) i++;
//        if (i == arrayLength) {
//            setStatus("Loaded: " + sample.length.toString() + " samples. Should Have: " + dataBack.slice(5) + " No strokes found");
//            return;
//        }

        for (j = 0; j < arrayLength; j++){
            if (sample[j][0] > 50 && sample[j][0] < 70 && sample[j][1] > 0) { // this is point that bell is moving heathily down @ handstroke
                k = j;
                if (swingStarts.length != 0) {
                    i = swingStarts[swingStarts.length-1]+1
                } else {
                    i=0;
                }
                while (k > i) {
                    k--; // step back from healthily down point
                    if (sample[k][1] <= 0.05){ // find point when bell is nearly stationary and define that as start of stroke
                        swingStarts[swingStarts.length] = k+1;
                        break;
                    }
                }
                if (k == i) {
                    setStatus("Loaded: " + sample.length.toString() + " samples. Should Have: " + dataBack.slice(5) + " Funny swing found. Possible incorrect data. But " + swingStarts.length.toString() + " strokes found. " + swingStarts.toString());
                    return;
                }
                while (j < arrayLength && sample[j][0] < 180) j++;  // move forward through sample past BDC
                if (j == arrayLength ) break;
            }
            if (sample[j][0] > 290 && sample[j][0] < 310 && sample[j][1] < 0) { // point where bell moving healthily down @ backstroke
                k = j;
                if (halfSwingStarts.length != 0) {
                    i = halfSwingStarts[halfSwingStarts.length-1]+1
                } else {
                    i=0;
                }
                while (k > i) { // step back from healthily down point
                    k--;
                    if (sample[k][1] >= -0.05){ // find point when bell is nearly stationary and define that as start of half stroke
                        halfSwingStarts[halfSwingStarts.length] = k+1;
                        break;
                    }
                }
                if (k == i) {
                    setStatus("Loaded: " + sample.length.toString() + " samples. Should Have: " + dataBack.slice(5) + " Funny half swing found. Possible incorrect data. But " + swingStarts.length.toString() + " strokes found. " + swingStarts.toString());
                    return;
                }
                while (j < arrayLength && sample[j][0] > 180) j++;
            }
        }
        setStatus("Loaded: " + sample.length.toString() + " samples. Should Have: " + dataBack.slice(5) + ". " + swingStarts.length.toString() + " strokes found.");
//        setStatus("Loaded: " + halfSwingStarts);

        // rebuild file list
        document.getElementById("openSelect").options.length = 0;
        ws.send("FILE:");
        return;
    }
    if (dataBack.slice(0,5) == "STRT:"){
        setStatus("Recording started");
        return;
    }
    if (dataBack.slice(0,5) == "EIMU:"){
        setStatus("IMU not active.  Is one connected to device? Aborting");
        if ((currentStatus & RECORDINGSESSION) != 0) {
            document.getElementById("recordIcon").onclick()
        } else if ((currentStatus & LIVEVIEW) != 0) {
             document.getElementById("liveIcon").onclick()
        }
        currentStatus |= ABORTFLAG;
        return;
    }
    if (dataBack.slice(0,5) == "SAMP:"){
        sampleInterval = parseFloat(dataBack.slice(5))*1000;
        setStatus("Received sample period of " + sampleInterval.toString() + "ms");
        return;
    }

    if (dataBack.slice(0,5) == "ESTD:"){
        setStatus("Bell not at stand.  Aborting");
        if ((currentStatus & RECORDINGSESSION) != 0) {
            document.getElementById("recordIcon").onclick()
        } else if ((currentStatus & LIVEVIEW) != 0) {
             document.getElementById("liveIcon").onclick()
        }
        currentStatus |= ABORTFLAG;
        return;
    }
    if (dataBack.slice(0,5) == "EMOV:"){
        setStatus("Bell moving.  Aborting");
        if ((currentStatus & RECORDINGSESSION) != 0) {
            document.getElementById("recordIcon").onclick()
        } else if ((currentStatus & LIVEVIEW) != 0) {
             document.getElementById("liveIcon").onclick()
        }
        currentStatus |= ABORTFLAG;
        return;
    }

    setStatus(dataBack);
};

ws.onclose = function(event){
    wsOpened=false;
    setStatus("Error. Resetting device. Please press refresh.");
    if ((currentStatus & RECORDINGSESSION) != 0  || (currentStatus & LIVEVIEW) != 0) {
        currentStatus &= ~RECORDINGSESSION;
        currentStatus &= ~LIVEVIEW;
        updateIcons();
        if (liveintervalID != null) clearInterval(liveintervalID);
        liveintervalID=null;
        currentStatus &= ~(LASTHS1 | LASTBS1 | LASTHS2 | LASTBS2);
        clearBell();
        currentPlaybackPosition=1;
    }
};

////////////////////////////////////////////////////////////////
//                       DATA FUNCTIONS                       //
////////////////////////////////////////////////////////////////

function extractData(datastring){
    var entries = datastring.split(",");
//    return [parseFloat(entries[0].slice(2)), parseFloat(entries[1].slice(2)), parseFloat(entries[2].slice(2)) * 4000.0];
        return [parseFloat(entries[0].slice(2)), parseFloat(entries[1].slice(2)), parseFloat(entries[2].slice(2))];
//    

}

function playbackSample(){
//         playintervalID=setInterval(playbackSample,sampleInterval*(100/playbackRanges[currentPlaybackSpeed][1]));
// sampleInterval*collectChunk*(100/playbackRanges[currentPlaybackSpeed][1])
    var normalChunk = collectInterval/sampleInterval;
    var iterations = Math.round((playbackRanges[currentPlaybackSpeed]/100.0) * normalChunk); // do this so that slower speeds are smoother
    if (currentPlaybackPosition + iterations > sample.length-1){
        iterations = sample.length-currentPlaybackPosition-1;
    }
    drawSamples(currentPlaybackPosition,iterations);
    currentPlaybackPosition += iterations;
    if (currentPlaybackPosition >= sample.length-1){ // reached end of sample, so stop
        currentStatus &= ~PLAYBACK
        updateIcons();
        if (playintervalID != null) clearInterval(playintervalID);
        playintervalID=null;
        currentStatus &= ~(LASTHS1 | LASTBS1 | LASTHS2 | LASTBS2);
        currentPlaybackPosition =1;  // reset to 1 so that dataEntryOld works
    }
}

function getWeighting(){
    var result = 0, guessLog;
    if ((currentStatus & SESSIONLOADED) == 0) return;
    for(guessLog = 14; guessLog >= 0; --guessLog){
        if(calculateError(result + Math.pow(2,guessLog)) < 0) result += Math.pow(2,guessLog);
    }
    return result;
}

function calculateError(guess){
    var count = 0.0, error = 0.0;
    for(var i = 0; i < sample.length; i++){
        if(sample[i][0] > 70 && sample[i][0] < 110 && sample[i][1] > 0){
            count += 1;
            error += guess*Math.sin(sample[i][0]*3.1416/180) - sample[i][2];
        } else if(sample[i][0] < 290 && sample[i][0] > 250 && sample[i][1] < 0){
            count += 1;
            error += -guess*Math.sin(sample[i][0]*3.1416/180) + sample[i][2];
        }

        if(count > 4000) break; // should be enough
    }
    error /= count;
    return error;
}

function showLive(){
//    ws.send("LDAT:"); // consider removing this line.
    var iterations = (sample.length-1) - currentPlaybackPosition;
    if (iterations < 5) return; // draw not fewer than 5 samples at a time
    drawSamples(currentPlaybackPosition,iterations);
    currentPlaybackPosition += iterations;
    setStatus("Loaded: " + currentPlaybackPosition.toString());
}

function drawTimer(position, templated){
    var timeElapsed = ((position-strokeTimer)*sampleInterval)/1000.0;
    if (timeElapsed < 0.2) return; // assume a glitch
    ctxBD.font = "12px sans serif";
    ctxBD.fillStyle = "white";
    if ((currentStatus & LASTBS2) != 0 ) {  // i.e. timing backstroke
        ctxBD.clearRect(posCB+1, ctxBD.canvas.height-20, CBwidth-2, 10);
        if (timeElapsed > 0.5) {
            ctxBD.textAlign = "center";
            ctxBD.fillText("B " +timeElapsed.toFixed(2)+"s", posCB + CBwidth/2, ctxBD.canvas.height-10);
        }
    } else {
        ctxBD.clearRect(posCB+1, ctxBD.canvas.height-50, CBwidth-2, 10);
        if (timeElapsed > 0.5) {
            ctxBD.textAlign = "center";
            ctxBD.fillText("H " + timeElapsed.toFixed(2)+"s", posCB + CBwidth/2, ctxBD.canvas.height-40);
        }
    }
    strokeTimer=position;
}

function drawSamples(position,iterations){
    var stepSize = (BDwidth * 1.0)/(ROIL-ROIU);
    for (var i = 0; i < iterations; i++){
        var dataEntryOld = sample[position + i -1].slice();
        var dataEntryCurrent = sample[position + i].slice();
        var dataEntryNext = sample[position + i + 1].slice();
        if(calibrationValue != null){
            dataEntryCurrent[2] -= calibrationValue*Math.sin(dataEntryCurrent[0]*3.1416/180);
        }
        drawBell(180-dataEntryCurrent[0]);
        drawAT(dataEntryCurrent[2]);
        if (dataEntryCurrent[0] > ROIU && dataEntryCurrent[0] < ROIL && dataEntryCurrent[1] >= 0) { // within ROI for HS1

            if (dataEntryNext[0] >= ROIL) {
                dataEntryCurrent[0] = ROIL; // tidy up at end of ROI
            }
            var startAngle = Math.max(ROIU,dataEntryOld[0]);
            var endAngle = dataEntryCurrent[0];
            if (endAngle <= startAngle) {
                continue; // for moment don't swap, just do nothing
            }
            if ((currentStatus & LASTHS1) == 0 ) { // clear highest part of this and previous ROI if this is the first time
                var pixelsFromROIL = (ROIL - startAngle) * stepSize;
                ctxBD.clearRect(posBS2 + pixelsFromROIL, 14, 2 * (BDwidth - pixelsFromROIL), ctxBD.canvas.height - 14 - 25);
                if ((currentStatus & LASTBS2) != 0 ) {
                    drawTimer(position + i, false);
                } else {
                    strokeTimer = 0; // not started yet
                }
                currentStatus &= ~(LASTBS2 | LASTBS1 | LASTHS2);
                currentStatus |= LASTHS1;
            }
            var pixelsFromROIU = (startAngle - ROIU) * stepSize;
            var pixelWidth = (endAngle - startAngle) * stepSize;
            var pixelHeight = (ctxBD.canvas.height - 14 - 25) * Math.min(dataEntryCurrent[2]/scaleValue,1);
            if (pixelHeight < 0) pixelHeight = 0;


            ctxBD.clearRect(posHS1 + pixelsFromROIU, 14, pixelWidth + 1, ctxBD.canvas.height - 14 - 25);
            ctxBD.fillStyle="white";
            ctxBD.fillRect(posHS1 + pixelsFromROIU, ctxBD.canvas.height - 25, pixelWidth, (0-pixelHeight));

        } else if (dataEntryCurrent[0] > (360 - ROIL) && dataEntryCurrent[0] < (360 - ROIU) && dataEntryCurrent[1] >= 0) { // within ROI for HS2
            var endAngle = Math.max(ROIU, 360-dataEntryCurrent[0]);
            var startAngle = Math.min(360-dataEntryOld[0], ROIL);
            if (endAngle >= startAngle) {
                continue; // for moment don't swap, just do nothing
            }
            if ((currentStatus & LASTHS2) == 0 ) { // set flags if we have not been before this swing
                currentStatus &= ~(LASTHS1 | LASTBS1 | LASTBS2);
                currentStatus |= LASTHS2;
            }
            var pixelsFromROIL = (ROIL - startAngle) * stepSize;
            var pixelWidth = (startAngle - endAngle) * stepSize;

            var pixelHeight = (ctxBD.canvas.height - 14 - 25) * Math.min(-(dataEntryCurrent[2])/scaleValue,1);
            if (pixelHeight < 0) pixelHeight = 0;

            ctxBD.clearRect(posHS2 + pixelsFromROIL, 14, pixelWidth + 1, ctxBD.canvas.height - 14 - 25);
            ctxBD.fillStyle="white";
            ctxBD.fillRect(posHS2 + pixelsFromROIL, ctxBD.canvas.height - 25, pixelWidth, (0-pixelHeight));
          
        } else if (dataEntryCurrent[0] > (360 - ROIL) && dataEntryCurrent[0] < (360 - ROIU) && dataEntryCurrent[1] < 0) { // within ROI for BS1
            if (dataEntryNext[0] <= (360 - ROIL)) {
                dataEntryCurrent[0] = (360 - ROIL); // tidy up at end of ROI
            }
            var startAngle = Math.max(ROIU,360-dataEntryOld[0]);
            var endAngle = Math.min(ROIL,360-dataEntryCurrent[0]);
            if (startAngle >= endAngle) {
                continue; // for moment don't swap, just do nothing
            }
            if ((currentStatus & LASTBS1) == 0 ) { // clear highest part of this and previous ROI if this is the first time
                var pixelsFromROIL = (ROIL - startAngle) * stepSize;
                ctxBD.clearRect(posHS2 + pixelsFromROIL, 14, 2 * (BDwidth - pixelsFromROIL), ctxBD.canvas.height - 14 - 25);
                if ((currentStatus & LASTHS2) != 0 ) {
                    drawTimer(position + i, false);
                }
                currentStatus &= ~(LASTBS2 | LASTHS1 | LASTHS2);
                currentStatus |= LASTBS1;
            }
            var pixelsFromROIU = (startAngle - ROIU) * stepSize;
            var pixelWidth = (endAngle - startAngle) * stepSize;

            var pixelHeight = (ctxBD.canvas.height - 14 - 25) * Math.min(-(dataEntryCurrent[2])/scaleValue,1)
            if (pixelHeight < 0) pixelHeight = 0;

            ctxBD.clearRect(posBS1 + pixelsFromROIU, 14, pixelWidth + 1, ctxBD.canvas.height - 14 - 25);
            ctxBD.fillStyle="white";
            ctxBD.fillRect(posBS1 + pixelsFromROIU, ctxBD.canvas.height - 25, pixelWidth, (0-pixelHeight));
            
        } else if (dataEntryCurrent[0] > ROIU && dataEntryCurrent[0] < ROIL && dataEntryCurrent[1] < 0) { // within ROI for BS2
            var endAngle = Math.max(ROIU,dataEntryCurrent[0]);
            var startAngle = Math.min(dataEntryOld[0],ROIL);
            if (endAngle >= startAngle) {
                continue; // for moment don't swap, just do nothing
            }
            if ((currentStatus & LASTBS2) == 0 ) { // set flags if we have not been before this swing
                currentStatus &= ~(LASTHS1 | LASTBS1 | LASTHS2);
                currentStatus |= LASTBS2;
            }
            var pixelsFromROIL = (ROIL - startAngle) * stepSize;
            var pixelWidth = (startAngle - endAngle) * stepSize;

            var pixelHeight = (ctxBD.canvas.height - 14 - 25) * Math.min((dataEntryCurrent[2])/scaleValue,1);
            if (pixelHeight < 0) pixelHeight = 0;

            ctxBD.clearRect(posBS2 + pixelsFromROIL, 14, pixelWidth + 1, ctxBD.canvas.height - 14 - 25);
            ctxBD.fillStyle="white";
            ctxBD.fillRect(posBS2 + pixelsFromROIL, ctxBD.canvas.height - 25, pixelWidth, (0-pixelHeight));

        }
    }
}

function drawAT(accn){
    var halfHeight = (ctxAT.canvas.height-ATbottomMargin)/2;
    var ypos = halfHeight + (halfHeight*(accn/scaleValue)/2);
    if (ypos < 0) ypos=0;
    if (ypos > halfHeight *2) ypos = halfHeight*2;
    if (currentATmargin >= ctxAT.canvas.width/2) currentATmargin = 0;
    currentATmargin += currentATpixels;
    ctxAT.clearRect(currentATmargin-currentATpixels,0,currentATpixels,ctxAT.canvas.height);
    ctxAT.clearRect(currentATmargin-currentATpixels+ctxAT.canvas.width/2,0,currentATpixels,ctxAT.canvas.height);
    ctxAT.beginPath();
    ctxAT.moveTo(currentATmargin-currentATpixels,ypos);
    ctxAT.lineTo(currentATmargin,ypos);
    ctxAT.moveTo(currentATmargin-currentATpixels+ctxAT.canvas.width/2,ypos);
    ctxAT.lineTo(currentATmargin+ctxAT.canvas.width/2,ypos);
    if ((currentStatus & LASTHS1) != 0 ||
        (currentStatus & LASTHS2) != 0) {
        ctxAT.strokeStyle="#FF8080";
    } else {
        ctxAT.strokeStyle="#80FF80";
    }
    ctxAT.lineWidth=2;
    ctxAT.stroke();
    document.getElementById("canvasAT").style.marginLeft = (currentATmargin * -1) + "px";
}

function clearTemplates(){
    ctxBDt.clearRect(0, 0, ctxBDt.canvas.width, ctxBDt.canvas.height);
}

function drawSamplesOnTemplate(){
    clearTemplates();
    var stepSize = (BDwidth * 1.0)/(ROIL-ROIU);
    for (var i = 1; i < template.length-1; i++){
        var dataEntryOld = template[i -1].slice();
        var dataEntryCurrent = template[i].slice();
        var dataEntryNext = template[i + 1].slice();
        if(calibrationValue != null){
            dataEntryCurrent[2] -= calibrationValue*Math.sin(dataEntryCurrent[0]*3.1416/180);
        }
        if (dataEntryCurrent[0] > ROIU && dataEntryCurrent[0] < ROIL && dataEntryCurrent[1] >= 0) { // within ROI for HS1

            if (dataEntryNext[0] >= ROIL) {
                dataEntryCurrent[0] = ROIL; // tidy up at end of ROI
            }
            var startAngle = Math.max(ROIU,dataEntryOld[0]);
            var endAngle = dataEntryCurrent[0];
            if (endAngle <= startAngle) {
                continue; // for moment don't swap, just do nothing
            }
            var pixelsFromROIU = (startAngle - ROIU) * stepSize;
            var pixelWidth = (endAngle - startAngle) * stepSize;

            var pixelHeight = (ctxBDt.canvas.height - 14 - 25) * Math.min(dataEntryCurrent[2]/scaleValue,1);
            if (pixelHeight < 0) pixelHeight = 0;
            ctxBDt.fillStyle="rgba(240,240,0,0.6)";
            ctxBDt.fillRect(posHS1 + pixelsFromROIU, ctxBDt.canvas.height - 25, pixelWidth, (0-pixelHeight));

        } else if (dataEntryCurrent[0] > (360 - ROIL) && dataEntryCurrent[0] < (360 - ROIU) && dataEntryCurrent[1] >= 0) { // within ROI for HS2
            var endAngle = Math.max(ROIU, 360-dataEntryCurrent[0]);
            var startAngle = Math.min(360-dataEntryOld[0], ROIL);
            
            if (endAngle >= startAngle) {
                continue; // for moment don't swap, just do nothing
            }
            var pixelsFromROIL = (ROIL - startAngle) * stepSize;
            var pixelWidth = (startAngle - endAngle) * stepSize;

            var pixelHeight = (ctxBDt.canvas.height - 14 - 25) * Math.min(-(dataEntryCurrent[2])/scaleValue,1);
            if (pixelHeight < 0) pixelHeight = 0;

            ctxBDt.fillStyle="rgba(240,240,0,0.6)";
            ctxBDt.fillRect(posHS2 + pixelsFromROIL, ctxBDt.canvas.height - 25, pixelWidth, (0-pixelHeight));
            
        } else if (dataEntryCurrent[0] > (360 - ROIL) && dataEntryCurrent[0] < (360 - ROIU) && dataEntryCurrent[1] < 0) { // within ROI for BS1

            if (dataEntryNext[0] <= (360 - ROIL)) {
                dataEntryCurrent[0] = (360 - ROIL); // tidy up at end of ROI
            }
            var startAngle = Math.max(ROIU,360-dataEntryOld[0]);
            var endAngle = Math.min(ROIL,360-dataEntryCurrent[0]);
            
            if (startAngle >= endAngle) {
                continue; // for moment don't swap, just do nothing
            }
            var pixelsFromROIU = (startAngle - ROIU) * stepSize;
            var pixelWidth = (endAngle - startAngle) * stepSize;

            var pixelHeight = (ctxBDt.canvas.height - 14 - 25) * Math.min(-(dataEntryCurrent[2])/scaleValue,1)
            if (pixelHeight < 0) pixelHeight = 0;
            ctxBDt.fillStyle="rgba(240,240,0,0.6)";
            ctxBDt.fillRect(posBS1 + pixelsFromROIU, ctxBDt.canvas.height - 25, pixelWidth, (0-pixelHeight));
       
        } else if (dataEntryCurrent[0] > ROIU && dataEntryCurrent[0] < ROIL && dataEntryCurrent[1] < 0) { // within ROI for BS2
            var endAngle = Math.max(ROIU,dataEntryCurrent[0]);
            var startAngle = Math.min(dataEntryOld[0],ROIL);
            if (endAngle >= startAngle) {
                continue; // for moment don't swap, just do nothing
            }
            var pixelsFromROIL = (ROIL - startAngle) * stepSize;
            var pixelWidth = (startAngle - endAngle) * stepSize;

            var pixelHeight = (ctxBDt.canvas.height - 14 - 25) * Math.min((dataEntryCurrent[2])/scaleValue,1);
            if (pixelHeight < 0) pixelHeight = 0;
            ctxBDt.fillStyle="rgba(240,240,0,0.6)";
            ctxBDt.fillRect(posBS2 + pixelsFromROIL, ctxBDt.canvas.height - 25, pixelWidth, (0-pixelHeight));
        }
    }
    drawTDCs();  // function checks what needs to be drawn on template like gridlines and target angles
}

function setStatus(text){
    document.getElementById("statusLine").innerHTML=text;
    if (statusintervalID != null) clearInterval(statusintervalID);
    statusintervalID=setInterval(clearStatus,5000); // display status for 5 seconds
}

function clearStatus() {
    document.getElementById("statusLine").innerHTML="";
    clearInterval(statusintervalID);
    statusintervalID=null;
}

////////////////////////////////////////////////////////////////
//                    ICON CLICK FUNCTIONS                    //
////////////////////////////////////////////////////////////////

fileOpenButton.onclick = function() {
    if ((currentStatus & DOWNLOADINGFILE) != 0) return;
    if ((currentStatus & PLAYBACK) != 0) return;
    if ((currentStatus & HELPDISPLAYED) != 0) return;
    if ((currentStatus & RECORDINGSESSION) != 0) return;
    var e = document.getElementById("openSelect");
    sample = [];
    ws.send("LOAD:" + e.options[e.selectedIndex].text);
    openModal.style.display = "none";
    currentStatus |= DOWNLOADINGFILE;
    currentStatus &= ~SESSIONLOADED;
    currentSwingDisplayed = null;
    calibrationValue = null;
    document.getElementById("calibrateButton").textContent= "Calibrate (None)";
    updateIcons();
}

targetSelectHand.onchange = function() {
    var h = document.getElementById("targetSelectHand");
    var t = h.options[h.selectedIndex].text
    if (t.isNaN) {
        targetAngleHand=null
    } else {
        targetAngleHand=parseInt(t)
    }
    if ((currentStatus & FAVOURITEDISPLAYED) != 0){
        drawSamplesOnTemplate();
    } else {
        clearTemplates();
        drawTDCs();
    }

}

targetSelectBack.onchange = function() {
    var b = document.getElementById("targetSelectBack");
    var t = b.options[b.selectedIndex].text
    if (t.isNaN) {
        targetAngleBack=null
    } else {
        targetAngleBack=parseInt(t)
    }
    if ((currentStatus & FAVOURITEDISPLAYED) != 0){
        drawSamplesOnTemplate();
    } else {
        clearTemplates();
        drawTDCs();
    }
}

zoomSelect.onchange = function(){
    currentROI = document.getElementById("zoomSelect").selectedIndex;
    ROIU = ROIRanges[currentROI][0];
    ROIL = ROIRanges[currentROI][1];
    drawFrame();
    if ((currentStatus & FAVOURITEDISPLAYED) != 0) {
        drawSamplesOnTemplate();
    } else {
        clearTemplates();
        drawTDCs();
    }
    if (currentSwingDisplayed == null) return;

    for (var startpoint = swingStarts[currentSwingDisplayed]; startpoint > 3; --startpoint){
        if (sample[startpoint][0] > 90) break;
    }
    var endpoint = 0;
    if (currentSwingDisplayed > halfSwingStarts.length -1) {
        endpoint = sample.length - 3;
    } else {
        for (endpoint = halfSwingStarts[currentSwingDisplayed]; endpoint < sample.length -3; ++endpoint){
            if (sample[endpoint][0] < 270) break;
        }
    }
    drawSamples(startpoint,endpoint-startpoint);
    
    textBell((currentSwingDisplayed+1).toString());
    currentStatus &= ~(LASTHS1 | LASTBS1 | LASTHS2 | LASTBS2);
}

speedSelect.onchange = function(){
    currentPlaybackSpeed = document.getElementById("speedSelect").selectedIndex;
// consider whether to allow this to be changed during active playback
}


scaleSelect.onchange = function() {
    scaleValue=parseFloat(scales[document.getElementById("scaleSelect").selectedIndex])
    drawFrame();
    clearAT();
    if ((currentStatus & FAVOURITEDISPLAYED) != 0) {
        drawSamplesOnTemplate();
    } else {
        clearTemplates();
        drawTDCs();
    }
    if (currentSwingDisplayed == null) return;
    
    for (var startpoint = swingStarts[currentSwingDisplayed]; startpoint > 3; --startpoint){
        if (sample[startpoint][0] > 90) break;
    }
    var endpoint = 0;
    if (currentSwingDisplayed > halfSwingStarts.length -1) {
        endpoint = sample.length - 3;
    } else {
        for (endpoint = halfSwingStarts[currentSwingDisplayed]; endpoint < sample.length -3; ++endpoint){
            if (sample[endpoint][0] < 270) break;
        }
    }
//    if (currentSwingDisplayed == swingStarts.length - 1){
//        iterations = (sample.length - 3) - swingStarts[currentSwingDisplayed];
//    } else {
//        iterations = (swingStarts[currentSwingDisplayed +1]-1) - swingStarts[currentSwingDisplayed];
//    }
    drawSamples(startpoint,endpoint-startpoint);
//    drawSamples(swingStarts[currentSwingDisplayed],iterations);
    textBell((currentSwingDisplayed+1).toString());
    currentStatus &= ~(LASTHS1 | LASTBS1 | LASTHS2 | LASTBS2);
}


recordIcon.onclick=function(){
    if (nonLive){
        alert("Not implemented for this demo");
        return;
    }
    if (sampleInterval == 0.0){
        setStatus("No communication with IMU device.  Aborted.");
        return;
    }
    if ((currentStatus & DOWNLOADINGFILE) != 0) return;
    if ((currentStatus & PLAYBACK) != 0) return;
    if ((currentStatus & HELPDISPLAYED) != 0) return;
    if ((currentStatus & LIVEVIEW) != 0) return;
    if ((currentStatus & RECORDINGSESSION) != 0) {
        currentStatus &= ~RECORDINGSESSION;
        updateIcons();
        if (liveintervalID != null) clearInterval(liveintervalID);
        liveintervalID=null;
        currentStatus &= ~(LASTHS1 | LASTBS1 | LASTHS2 | LASTBS2);
        clearBell();
        currentPlaybackPosition=1;
        ws.send("STOP:");
    } else {
        document.getElementById("recordFileName").value = "";
        document.getElementById("nameInvalid").style.visibility = "hidden";
        recordModal.style.display = "block";
        document.getElementById("recordFileName").focus();
    }
}

recordButton.onclick = function() {
    var fileName = document.getElementById("recordFileName").value;
    var patt = /^[a-z0-9_. ()-]+$/i;
    if ((patt.test(fileName) && fileName.length < 31) || fileName == "") {
        recordModal.style.display = "none";
        currentStatus |= RECORDINGSESSION;
        currentStatus &= ~SESSIONLOADED;
        updateIcons();
        drawFrame();
        sample = [];
        clearAT();
        currentPlaybackPosition = 1; // needs to be one as we are doing comparison with previous entry removed so that playback starts from last swing displayed
        if (liveintervalID != null) clearInterval(liveintervalID);
        liveintervalID=setInterval(showLive,collectInterval);
        currentSwingDisplayed=null;
        ws.send("STRT:" + fileName);
    } else {
        document.getElementById("nameInvalid").style.visibility = "visible";
    }
};

calibrateButton.onclick = function() {
    
    if ((currentStatus & SESSIONLOADED) == 0) return;
    if ((currentStatus & DOWNLOADINGFILE) != 0) return;
    if ((currentStatus & PLAYBACK) != 0) return;
    if ((currentStatus & HELPDISPLAYED) != 0) return;
    if ((currentStatus & LIVEVIEW) != 0) return;
    if ((currentStatus & RECORDINGSESSION) != 0) return
    calibrationValue = getWeighting();
    document.getElementById("calibrateButton").textContent= "Calibrate (" + calibrationValue + ")";
 };


/*
 * https://stackoverflow.com/questions/7035842/how-to-change-the-buttons-text-using-javascript
 * 
 * function replaceButtonText(buttonId, text) {
 * if (document.getElementById)
 * {
 *   var button=document.getElementById(buttonId);
 *   if (button)
 *   {
 *     if (button.childNodes[0])
 *     {
 *       button.childNodes[0].nodeValue=text;
 *     }
 *     else if (button.value)
 *     {
 *       button.value=text;
 *     }
 *     else 
 *     {
 *       button.innerHTML=text;
 *     }
 *   }
 * }
 *}
 * 
 */
/*
liveIcon.onclick = function() {
    if (nonLive){
        alert("Not implemented for this demo");
        return;
    }
    if (sampleInterval == 0.0){
        setStatus("No communication with IMU device.  Aborted.");
        return;
    }

    if ((currentStatus & DOWNLOADINGFILE) != 0) return;
    if ((currentStatus & PLAYBACK) != 0) return;
    if ((currentStatus & HELPDISPLAYED) != 0) return;
    if ((currentStatus & RECORDINGSESSION) != 0) return;
    if ((currentStatus & LIVEVIEW) != 0) {
        currentStatus &= ~LIVEVIEW;
        updateIcons();
        if (liveintervalID != null) clearInterval(liveintervalID);
        liveintervalID=null;
        currentStatus &= ~(LASTHS1 | LASTBS1 | LASTHS2 | LASTBS2);
        clearBell();
        currentPlaybackPosition=1;
        ws.send("STOP:");
    } else {
        currentStatus |= LIVEVIEW;
        currentStatus &= ~SESSIONLOADED;
        updateIcons();
        drawFrame();
        clearAT();
        sample = [];
        currentPlaybackPosition = 1; // needs to be one as we are doing comparison with previous entry removed so that playback starts from last swing displayed
        if (liveintervalID != null) clearInterval(liveintervalID);
        liveintervalID=setInterval(showLive,collectInterval);
        currentSwingDisplayed=null;
        ws.send("STRT:");
    }
};
*/

// to do, when PLAYED THEN stopped scaling does not work
// set templte displayed so we know to scale template

powerIcon.onclick = function() {
    if (nonLive){
        alert("Not implemented for this demo");
        return;
    }
    if ((currentStatus & DOWNLOADINGFILE) != 0) return;
    if ((currentStatus & PLAYBACK) != 0) return;
    if ((currentStatus & RECORDINGSESSION) != 0) return;
    if (confirm("Are you sure you want to power off?")) ws.send("SHDN:");
    return;
};

playIcon.onclick=function(){
    if ((currentStatus & DOWNLOADINGFILE) != 0) return;
    if ((currentStatus & RECORDINGSESSION) != 0) return;
    if ((currentStatus & SESSIONLOADED) == 0) return;
    if ((currentStatus & HELPDISPLAYED) != 0) return;

    if ((currentStatus & PLAYBACK) != 0) {
        currentStatus &= ~PLAYBACK;
        currentStatus &= ~PAUSED;
        updateIcons();
        if (playintervalID != null) clearInterval(playintervalID);
        playintervalID=null;
        currentStatus &= ~(LASTHS1 | LASTBS1 | LASTHS2 | LASTBS2);
        clearBell();
        currentPlaybackPosition=1;
    } else {
        currentStatus |= PLAYBACK;
        currentStatus &= ~PAUSED;
        updateIcons();
        drawFrame();
        clearAT();
//        currentPlaybackPosition =1; // needs to be one as we are doing comparison with previous entry removed so that playback starts from last swing displayed
        if (playintervalID != null) clearInterval(playintervalID);
        playintervalID=setInterval(playbackSample,collectInterval);
        currentSwingDisplayed=null;
    }
};

pauseIcon.onclick=function(){
    if ((currentStatus & DOWNLOADINGFILE) != 0) return;
    if ((currentStatus & RECORDINGSESSION) != 0) return;
    if ((currentStatus & SESSIONLOADED) == 0) return;
    if ((currentStatus & HELPDISPLAYED) != 0) return;
    if ((currentStatus & PLAYBACK) == 0) return;

    if ((currentStatus & PAUSED) != 0) {
        currentStatus &= ~PAUSED
        if (playintervalID != null) clearInterval(playintervalID);
        playintervalID=setInterval(playbackSample,collectInterval)
        clearBell();
    } else {
        currentStatus |= PAUSED;
        if (playintervalID != null) clearInterval(playintervalID);
        textBell("Paused");
    }
};

backIcon.onclick=function(){
    if ((currentStatus & DOWNLOADINGFILE) != 0) return;
    if ((currentStatus & RECORDINGSESSION) != 0) return;
    if ((currentStatus & SESSIONLOADED) == 0) return;
    if ((currentStatus & HELPDISPLAYED) != 0) return;
    if ((currentStatus & PLAYBACK) != 0) return;
    if (currentSwingDisplayed == 0) return;
    if (currentSwingDisplayed == null) currentSwingDisplayed=1;
    currentSwingDisplayed -= 1;
    drawFrame();
    
    for (var startpoint = swingStarts[currentSwingDisplayed]; startpoint > 3; --startpoint){
        if (sample[startpoint][0] > 90) break;
    }
    var endpoint = 0;
    if (currentSwingDisplayed > halfSwingStarts.length -1) {
        endpoint = sample.length - 3;
    } else {
        for (endpoint = halfSwingStarts[currentSwingDisplayed]; endpoint < sample.length -3; ++endpoint){
            if (sample[endpoint][0] < 270) break;
        }
    }

//    drawSamples(swingStarts[currentSwingDisplayed],(swingStarts[currentSwingDisplayed+1]-1) - swingStarts[currentSwingDisplayed]);
    drawSamples(startpoint,endpoint-startpoint);

    textBell((currentSwingDisplayed+1).toString());
    currentStatus &= ~(LASTHS1 | LASTBS1 | LASTHS2 | LASTBS2);
    updateIcons();
};

forwardIcon.addEventListener("touchstart", preventZoom);

forwardIcon.onclick=function(){
    if ((currentStatus & DOWNLOADINGFILE) != 0) return;
    if ((currentStatus & RECORDINGSESSION) != 0) return;
    if ((currentStatus & SESSIONLOADED) == 0) return;
    if ((currentStatus & HELPDISPLAYED) != 0) return;
    if ((currentStatus & PLAYBACK) != 0) return;
    if (currentSwingDisplayed == swingStarts.length - 1) return;
    if (currentSwingDisplayed == null) currentSwingDisplayed = -1;
    var iterations = null;
    currentSwingDisplayed += 1;
    
    for (var startpoint = swingStarts[currentSwingDisplayed]; startpoint > 3; --startpoint){
        if (sample[startpoint][0] > 90) break;
    }
    var endpoint = 0;
    if (currentSwingDisplayed > halfSwingStarts.length -1) {
        endpoint = sample.length - 3;
    } else {
        for (endpoint = halfSwingStarts[currentSwingDisplayed]; endpoint < sample.length -3; ++endpoint){
            if (sample[endpoint][0] < 270) break;
        }
    }
    drawFrame();
    drawSamples(startpoint,endpoint-startpoint);
    textBell((currentSwingDisplayed+1).toString());
    currentStatus &= ~(LASTHS1 | LASTBS1 | LASTHS2 | LASTBS2);
    updateIcons();
};

favIcon.onclick=function(){
    if ((currentStatus & DOWNLOADINGFILE) != 0) return;
    if ((currentStatus & RECORDINGSESSION) != 0) return;
    if ((currentStatus & SESSIONLOADED) == 0) return;
    if ((currentStatus & HELPDISPLAYED) != 0) return;
    if ((currentStatus & PLAYBACK) != 0) return;
    if (currentSwingDisplayed == null) return;

    for (var startpoint = swingStarts[currentSwingDisplayed]; startpoint > 3; --startpoint){
        if (sample[startpoint][0] > 90) break;
    }
    var endpoint = 0;
    if (currentSwingDisplayed > halfSwingStarts.length -1) {
        endpoint = sample.length - 3;
    } else {
        for (endpoint = halfSwingStarts[currentSwingDisplayed]; endpoint < sample.length -3; ++endpoint){
            if (sample[endpoint][0] < 270) break;
        }
    }

//    if (currentSwingDisplayed == swingStarts.length - 1){
//        iterations = (sample.length - 3) - swingStarts[currentSwingDisplayed];
//    } else {
//        iterations = (swingStarts[currentSwingDisplayed +1]-1) - swingStarts[currentSwingDisplayed];
//    }

    template=[];
//    for (var i = 0; i<iterations; i++) template[template.length]=sample[swingStarts[currentSwingDisplayed]+i].slice();
    for (var i = startpoint; i<endpoint; ++i) template[template.length]=sample[i].slice();

    drawSamplesOnTemplate();
//    currentStatus &= ~(LASTHS1 | LASTBS1 | LASTHS2 | LASTBS2);
    currentStatus |= FAVOURITEDISPLAYED;
    updateIcons();
};

unstarIcon.onclick=function(){
    if ((currentStatus & DOWNLOADINGFILE) != 0) return;
    if ((currentStatus & RECORDINGSESSION) != 0) return;
    if ((currentStatus & SESSIONLOADED) == 0) return;
    if ((currentStatus & HELPDISPLAYED) != 0) return;
    if ((currentStatus & PLAYBACK) != 0) return;

    template=[];
    clearTemplates();
    currentStatus &= ~FAVOURITEDISPLAYED;
    drawTDCs();
    updateIcons();
};

helpIcon.onclick=function(){
    if ((currentStatus & DOWNLOADINGFILE) != 0) return;
    if ((currentStatus & PLAYBACK) != 0) return;
    if ((currentStatus & RECORDINGSESSION) != 0) return;

    if ((currentStatus & HELPDISPLAYED) != 0) {
        currentStatus &= ~HELPDISPLAYED;
        document.getElementById("bellGraphics").style.display = "block";
        document.getElementById("helpScreen").style.display = "none";
    } else {
        currentStatus |= HELPDISPLAYED;
        document.getElementById("bellGraphics").style.display = "none";
        document.getElementById("helpScreen").style.display = "block";
    }
    updateIcons();
};

function updateIcons(){
    // recordIcon
    if ((currentStatus & DOWNLOADINGFILE) != 0 ||
        (currentStatus & PLAYBACK) != 0 ||
        (currentStatus & LIVEVIEW) != 0 ||
        (currentStatus & HELPDISPLAYED) != 0) {
        document.getElementById("recordIcon").src = "circle-record-inactive.png";
    } else {
        if ((currentStatus & RECORDINGSESSION) != 0) {
            document.getElementById("recordIcon").src = "circle-stop-active.png";
        } else {
            document.getElementById("recordIcon").src = "circle-record-active.png";
        }
    }

    // powerIcon
    if ((currentStatus & DOWNLOADINGFILE) != 0 ||
        (currentStatus & PLAYBACK) != 0 ||
        (currentStatus & LIVEVIEW) != 0 ||
        (currentStatus & RECORDINGSESSION) != 0) {
        document.getElementById("powerIcon").src = "circle-power-inactive.png";
    } else {
        document.getElementById("powerIcon").src = "circle-power-active.png";
    }

    // settings icon
    if ((currentStatus & DOWNLOADINGFILE) != 0 ||
        (currentStatus & HELPDISPLAYED) != 0) {
        document.getElementById("settingsIcon").src = "settings-inactive.png";
    } else {
        document.getElementById("settingsIcon").src = "settings-active.png";
    }

/*
    //liveIcon
    if ((currentStatus & DOWNLOADINGFILE) != 0 ||
        (currentStatus & PLAYBACK) != 0 ||
        (currentStatus & RECORDINGSESSION) != 0 ||
        (currentStatus & HELPDISPLAYED) != 0) {
        document.getElementById("liveIcon").src = "live-inactive.png";
    } else {
        if ((currentStatus & LIVEVIEW) != 0) {
            document.getElementById("liveIcon").src = "live-stop.png";
        } else {
            document.getElementById("liveIcon").src = "live-active.png";
        }

    }

*/

    //downloadIcon
    if ((currentStatus & DOWNLOADINGFILE) != 0 ||
        (currentStatus & PLAYBACK) != 0 ||
        (currentStatus & LIVEVIEW) != 0 ||
        (currentStatus & HELPDISPLAYED) != 0) {
        document.getElementById("downloadIcon").src = "cloud-download-inactive.png";
    } else {
        document.getElementById("downloadIcon").src = "cloud-download-active.png";
    }

    //playIcon
    if ((currentStatus & SESSIONLOADED) == 0) {
        document.getElementById("playIcon").src = "circle-play-inactive.png";
    } else {
        if ((currentStatus & DOWNLOADINGFILE) != 0 ||
            (currentStatus & LIVEVIEW) != 0 ||
            (currentStatus & HELPDISPLAYED) != 0) {
            document.getElementById("playIcon").src = "circle-play-inactive.png";
        } else {
            if ((currentStatus & PLAYBACK) != 0) {
                document.getElementById("playIcon").src = "circle-stop-active.png";
            } else {
                document.getElementById("playIcon").src = "circle-play-active.png";
            }
        }
    }

    //pauseIcon
    if ((currentStatus & PLAYBACK) == 0) {
        document.getElementById("pauseIcon").src = "circle-pause-inactive.png";
    } else {
        if ((currentStatus & DOWNLOADINGFILE) != 0 ||
            (currentStatus & LIVEVIEW) != 0 ||
            (currentStatus & HELPDISPLAYED) != 0) {
            document.getElementById("pauseIcon").src = "circle-pause-inactive.png";
        } else {
                document.getElementById("pauseIcon").src = "circle-pause-active.png";
        }
    }

    //skipIcons and fav icons
    if ((currentStatus & SESSIONLOADED) == 0) {
        document.getElementById("backIcon").src = "circle-back-inactive.png";
        document.getElementById("forwardIcon").src = "circle-forward-inactive.png";
        document.getElementById("favIcon").src = "circle-heart-inactive.png";
    } else {
        if ((currentStatus & DOWNLOADINGFILE) != 0 ||
            (currentStatus & PLAYBACK) != 0 ||
            (currentStatus & LIVEVIEW) != 0 ||
            (currentStatus & HELPDISPLAYED) != 0) {
            document.getElementById("backIcon").src = "circle-back-inactive.png";
            document.getElementById("forwardIcon").src = "circle-forward-inactive.png";
            document.getElementById("favIcon").src = "circle-heart-inactive.png";
        } else {
            if (currentSwingDisplayed == swingStarts.length - 1) {
                document.getElementById("forwardIcon").src = "circle-forward-inactive.png";
            } else {
                document.getElementById("forwardIcon").src = "circle-forward-active.png";
            }
            if (currentSwingDisplayed == 0) {
                document.getElementById("backIcon").src = "circle-back-inactive.png";
            } else {
                document.getElementById("backIcon").src = "circle-back-active.png";
            }
            if (currentSwingDisplayed != null) {
                document.getElementById("favIcon").src = "circle-heart-active.png";
            } else {
                document.getElementById("favIcon").src = "circle-heart-inactive.png";
            }
        }
    }

    // helpIcon
    if ((currentStatus & DOWNLOADINGFILE) != 0 ||
        (currentStatus & LIVEVIEW) != 0 ||
        (currentStatus & RECORDINGSESSION) != 0 ||
        (currentStatus & PLAYBACK) != 0) {
        document.getElementById("helpIcon").src = "help-inactive.png";
    } else {
        if ((currentStatus & HELPDISPLAYED) != 0) {
            document.getElementById("helpIcon").src = "door-out.png";
        } else {
            document.getElementById("helpIcon").src = "help.png";
        }
    }

    //remove template icon
    if ((currentStatus & DOWNLOADINGFILE) != 0 ||
        ((currentStatus & PLAYBACK) != 0 && (currentStatus & PAUSED) == 0) ||
        (currentStatus & HELPDISPLAYED) != 0) {
        document.getElementById("unstarIcon").src = "circle-cross-inactive.png";

    } else {
        if ((currentStatus & FAVOURITEDISPLAYED) != 0){
            document.getElementById("unstarIcon").src = "circle-cross-active.png";
        } else {
            document.getElementById("unstarIcon").src = "circle-cross-inactive.png";
        }
    }

    // settingsicon
       if ((currentStatus & DOWNLOADINGFILE) != 0 ||
        (currentStatus & PLAYBACK) != 0 ||
        (currentStatus & LIVEVIEW) != 0 ||
        (currentStatus & RECORDINGSESSION) != 0 ||
        (currentStatus & HELPDISPLAYED) != 0) {
        document.getElementById("settingsIcon").src = "settings-inactive.png";
    } else {
        document.getElementById("settingsIcon").src = "settings-active.png";
    }


}
////////////////////////////////////////////////////////////////
//                       MODAL FUNCTIONS                      //
////////////////////////////////////////////////////////////////


var openModal = document.getElementById("openModal");
var openBtn = document.getElementById("downloadIcon");
var openSpan = document.getElementsByClassName("close")[0];

var recordModal = document.getElementById("recordModal");
var recordSpan = document.getElementsByClassName("close")[1];


var settingsModal = document.getElementById("settingsModal");
var settingsBtn = document.getElementById("settingsIcon");
var settingsSpan = document.getElementsByClassName("close")[2];

openBtn.onclick = function() {
    if ((currentStatus & DOWNLOADINGFILE) != 0) return;
    if ((currentStatus & PLAYBACK) != 0) return;
    if ((currentStatus & HELPDISPLAYED) != 0) return;
    if ((currentStatus & RECORDINGSESSION) != 0) return;
    openModal.style.display = "block";
};

settingsBtn.onclick = function() {
    if ((currentStatus & DOWNLOADINGFILE) != 0) return;
    if ((currentStatus & PLAYBACK) != 0) return;
    if ((currentStatus & HELPDISPLAYED) != 0) return;
    if ((currentStatus & LIVEVIEW) != 0) return;
    if ((currentStatus & RECORDINGSESSION) != 0) return;
    settingsModal.style.display = "block";
};

// record button onclick is is main onclick area

// When the user clicks on <span> (x), close the modal
openSpan.onclick = function() {
    openModal.style.display = "none";
};

settingsSpan.onclick = function() {
    settingsModal.style.display = "none";
};

recordSpan.onclick = function() {
    recordModal.style.display = "none";
};


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == openModal) {
        openModal.style.display = "none";
    }
    if (event.target == settingsModal) {
        settingsModal.style.display = "none";
    }
    if (event.target == recordModal) {
        recordModal.style.display = "none";
    }
};

////////////////////////////////////////////////////////////////
//                   WINDOW RESIZE FUNCTIONS                  //
////////////////////////////////////////////////////////////////


//addEvent(window, "resize", recalculateSize());
window.addEventListener("resize", function(event){
  recalculateSize();
  if ((currentStatus & FAVOURITEDISPLAYED) !=0) {
      drawSamplesOnTemplate();
  } else {
    drawTDCs();
  }
});

window.addEventListener("load", function(event){
    recalculateSize();
    updateIcons();
    drawTDCs();
    clearAT();
    document.body.addEventListener("touchstart", preventZoom); // doesn't appear to work
});

function recalculateSize() {
    var winWidth =  window.innerWidth;
    var rightWidth = Math.max(800,winWidth-16);

    var canvasWidth=rightWidth-16;
    var canvasHeight=((rightWidth-CBwidth)/4)/1.3;

    var winHeight =  window.innerHeight;
    var rightHeight = winHeight - 210;

    document.getElementById("bellGraphics").style.width = rightWidth + "px";
    document.getElementById("bellGraphics").style.height = rightHeight + "px";
    document.getElementById("helpScreen").style.width = rightWidth + "px";
    document.getElementById("helpScreen").style.height = rightHeight + "px";
    document.getElementById("helpIframe").style.width = (rightWidth-42) + "px";
    document.getElementById("helpIframe").style.height = (rightHeight -20) + "px";

    canvasBD.width=canvasWidth;
    canvasBD.height=canvasHeight;
    canvasBD.style.top=10;
    canvasBD.style.left=8;
    canvasBDt.width=canvasWidth;
    canvasBDt.height=canvasHeight;
    canvasBDt.style.top=10;
    canvasBDt.style.left=8;

    posBS2 = 0;
    BDwidth = (canvasWidth-CBwidth)/4 
    posHS1 = BDwidth;
    posCB = BDwidth * 2;
    posHS2 = canvasWidth - (BDwidth *2);
    posBS1 = canvasWidth - BDwidth;
    radius = canvasHeight;

    canvasAT.width=rightWidth * 2;
    canvasAT.height=Math.min(canvasHeight,rightHeight-canvasHeight-20);
    canvasAT.style.top=(canvasHeight + 20) + (rightHeight - canvasAT.height - canvasBD.height)/2;
    canvasAT.style.left=0;
    canvasATt.width=rightWidth * 2;
    canvasATt.height=Math.min(canvasHeight,rightHeight-canvasHeight-20);
    canvasATt.style.top=(canvasHeight + 20) + (rightHeight - canvasAT.height - canvasBD.height)/2;
    canvasATt.style.left=0;
   
    ctxBD.fillStyle='rgba(0,0,255,0.1)';
    ctxBD.fillRect(posBS2,0,BDwidth,canvasBD.height);
    ctxBD.fillStyle='rgba(0,255,255,0.1)';
    ctxBD.fillRect(posHS1,0,BDwidth,canvasBD.height);
    ctxBD.fillStyle='rgba(255,0,255,0.1)';
    ctxBD.fillRect(posHS2,0,BDwidth,canvasBD.height);
    ctxBD.fillStyle='rgba(255,255,255,0.5)';
    ctxBD.fillRect(posBS1,0,BDwidth,canvasBD.height);
//    ctxBD.fillStyle='rgba(255,0,0,0.1)';
//    ctxBD.fillRect(posCB,0,CBwidth,canvasBD.height);
    
//    ctxAT.fillStyle='rgba(0,0,255,0.1)';
//    ctxAT.fillRect(0,0,canvasAT.width,canvasAT.height);
//    ctxATt.fillStyle='rgba(0,128,255,0.1)';
//    ctxATt.fillRect(0,0,(canvasATt.width/2),canvasATt.height);

//    ctxATBS.fillStyle='rgba(0,255,255,0.1)';
//    ctxATBS.fillRect(0,0,canvasATBS.width,canvasATBS.height);

    drawFrame();
    clearAT();
/*
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();

    ctxHS1t.fillStyle='rgba(0,0,255,0.1)';
    ctxHS1t.fillRect(0,0,canvasHS1t.width,canvasHS1t.height);
    ctxHS2t.fillStyle='rgba(0,255,255,0.1)';
    ctxHS2t.fillRect(0,0,canvasHS2t.width,canvasHS2t.height);
    ctxBS1t.fillStyle='rgba(0,255,0,0.1)';
    ctxBS1t.fillRect(0,0,canvasBS1t.width,canvasBS1t.height);
    ctxBS2t.fillStyle='rgba(255,0,255,0.1)';
    ctxBS2t.fillRect(0,0,canvasBS2t.width,canvasBS2t.height);
*/
}

function drawFrame(){
    ctxBD.clearRect(posBS2, 0, BDwidth * 2, ctxBD.canvas.height);
    ctxBD.clearRect(posHS2, 0, BDwidth * 2, ctxBD.canvas.height);
    ctxBD.lineWidth=1;
    ctxBD.font = "12px sans serif";
    ctxBD.fillStyle = "white";
    ctxBD.textAlign = "center";
    ctxBD.fillText("Handstroke Pull", posHS1+ BDwidth/2, 10);
    ctxBD.fillText("Handstroke Check", posHS2 + BDwidth/2, 10);
    ctxBD.fillText("Backstroke Pull", posBS1 + BDwidth/2, 10);
    ctxBD.fillText("Backstroke Check", BDwidth/2, 10);

    ctxBD.beginPath();
    ctxBD.strokeStyle="rgba(240,240,240,0.6)";
    ctxBD.rect(posBS2, -1, BDwidth, 13);
    ctxBD.rect(posHS1, -1, BDwidth, 13);
    ctxBD.rect(posHS2, -1, BDwidth, 13);
    ctxBD.rect(posBS1, -1, BDwidth, 13);
    ctxBD.rect(posBS2, ctxBD.canvas.height-24, BDwidth * 2, 25);
    ctxBD.rect(posHS2, ctxBD.canvas.height-24, BDwidth * 2, 25);

    ctxBD.stroke();
}

function textBell(text){
    ctxBD.clearRect(2*BDwidth , 0, 64, ctxBD.canvas.height);
    ctxBD.font="bold 16px verdana, sans-serif";
    ctxBD.textAlign="center";
    ctxBD.fillStyle = "white";
    ctxBD.fillText(text,2*BDwidth + 32,32);
}

function clearBell(){
//    ctxCB.clearRect(0, 0, ctxCB.canvas.width, ctxCB.canvas.height);
    ctxBD.clearRect(2*BDwidth, 0, 64, 64);

}

function clearAT(){
    ctxAT.clearRect(0, 0, ctxAT.canvas.width, ctxAT.canvas.height);
    ctxATt.clearRect(0, 0, ctxATt.canvas.width, ctxATt.canvas.height);
    ctxATt.fillStyle="rgba(204,204,230,0.1)";
    ctxATt.fillRect(0,0,canvasATt.width,canvasATt.height);
    currentATmargin=0;
    document.getElementById("canvasAT").style.marginLeft = (currentATmargin * -1) + "px";
    ctxATt.beginPath();
    ctxATt.rect(1,1,(ctxATt.canvas.width/2)-1, ctxATt.canvas.height-ATbottomMargin);
    var halfHeight = (ctxATt.canvas.height-ATbottomMargin)/2;
    ctxATt.moveTo(0,halfHeight);
    ctxATt.lineTo(ctxATt.canvas.width,halfHeight);
    ctxATt.lineWidth=1;
    ctxATt.strokeStyle="rgba(240,240,240,0.6)";
    ctxATt.stroke();
}

function drawBell(angle) {
    var DEG2RAD = Math.PI/180;
    var bx = 2*BDwidth + 32 + (Math.sin((angle - 80) * DEG2RAD) * 10);
    var by = 32 + (Math.cos((angle - 80) * DEG2RAD) * 10);
    var cx = 2*BDwidth + 32 + (Math.sin((angle -  5) * DEG2RAD) * 15);
    var cy = 32 + (Math.cos((angle -  5) * DEG2RAD) * 15);
    var dx = 2*BDwidth + 32 + (Math.sin((angle - 40) * DEG2RAD) * 30);
    var dy = 32 + (Math.cos((angle - 40) * DEG2RAD) * 30);
    var ex = 2*BDwidth + 32 + (Math.sin((angle + 80) * DEG2RAD) * 10);
    var ey = 32 + (Math.cos((angle + 80) * DEG2RAD) * 10);
    var fx = 2*BDwidth + 32 + (Math.sin((angle +  5) * DEG2RAD) * 15);
    var fy = 32 + (Math.cos((angle +  5) * DEG2RAD) * 15);
    var gx = 2*BDwidth + 32 + (Math.sin((angle + 40) * DEG2RAD) * 30);
    var gy = 32 + (Math.cos((angle + 40) * DEG2RAD) * 30);
    ctxBD.clearRect(2*BDwidth, 0, 64, 64);
    ctxBD.beginPath();
    ctxBD.moveTo(2*BDwidth + 32, 32);
    ctxBD.bezierCurveTo(bx, by, cx, cy, dx, dy);
    ctxBD.moveTo(2*BDwidth + 32, 32);
    ctxBD.bezierCurveTo(ex, ey, fx, fy, gx, gy);
    ctxBD.lineWidth = 4;
//    ctxCB.strokeStyle = "#303030";
    ctxBD.strokeStyle = "white";
    ctxBD.stroke();
}

function drawAccel(ctx, pos1, pos2, length, clearonly) {

    var scaleSize = 120/(ROIL-ROIU); // this is how much the position needs to be scaled
    var starta, enda, hand
    if (pos1 <= 180) pos1=-30+((pos1-ROIU)*scaleSize);
    if (pos2 <= 180) pos2=-30+((pos2-ROIU)*scaleSize);
    if (pos1 > 180) pos1=270+((pos1-(360-ROIL))*scaleSize);
    if (pos2 > 180) pos2=270+((pos2-(360-ROIL))*scaleSize);

    if (ctx === ctxHS1){ // handstroke down
        pos1=(pos1+180)*Math.PI/180;
        pos2=(pos2+180)*Math.PI/180;
        starta=0;
        enda=240*Math.PI/180;
        hand=true;

    } else if (ctx === ctxHS2) { // handstroke up
        pos1=(pos1-180)*Math.PI/180;
        pos2=(pos2-180)*Math.PI/180;
        starta= 180*Math.PI/180;
        enda = 300*Math.PI/180;
        hand=false;

    } else if (ctx === ctxBS1) { // backstroke down
        pos1=(180-pos1)*Math.PI/180;
        pos2=(180-pos2)*Math.PI/180;
        starta=0;
        enda=240*Math.PI/180;
        hand= true;

    } else if (ctx === ctxBS2) { // backstroke up
        pos1=(180-pos1)*Math.PI/180;
        pos2=(180-pos2)*Math.PI/180;
        starta= 180*Math.PI/180;
        enda = 300*Math.PI/180;
        hand=false;
    }
//clear section
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.rotate(pos1);
    ctx.moveTo(0, 0.15*radius);
    ctx.lineTo(0, 0.92*radius);
    ctx.rotate(pos2-pos1+0.03);//0.03 is 3 degrees over for clear
    ctx.arc(0,0,0.92*radius,(0.5*Math.PI)-(pos2-pos1),(0.5*Math.PI),false);
//    ctx.lineTo(0, length);
    ctx.lineTo(0, 0.15*radius);
    ctx.rotate(-pos2-0.03);
    ctx.fillStyle= BGCOLOUR;
    ctx.fill();

    if (clearonly == false){
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.rotate(pos1);
        ctx.moveTo(0, 0.15*radius);
        ctx.lineTo(0, (0.15*radius)+length);
        ctx.rotate(pos2-pos1);
        ctx.arc(0,0,(0.15*radius)+length,(0.5*Math.PI)-(pos2-pos1),(0.5*Math.PI),false);
    //    ctx.lineTo(0, length);
        ctx.lineTo(0, 0.15*radius);
        ctx.rotate(-pos2);
        ctx.fillStyle= "white";
        ctx.fill();
    }
    ctx.beginPath(); // redraw centre axles
    ctx.arc(0, 0, 0.05*radius, 0, 2*Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, 0.1*radius, starta, enda, hand);
    ctx.strokeStyle = "white";
    ctx.stroke();
}

function drawAccelT(ctx, pos1, pos2, length) {
    var scaleSize = 120/(ROIL-ROIU); // this is how much the position needs to be scaled
    if (pos1 <= 180) pos1=-30+((pos1-ROIU)*scaleSize);
    if (pos2 <= 180) pos2=-30+((pos2-ROIU)*scaleSize);
    if (pos1 > 180) pos1=270+((pos1-(360-ROIL))*scaleSize);
    if (pos2 > 180) pos2=270+((pos2-(360-ROIL))*scaleSize);

    if (ctx === ctxHS1t){ // handstroke down
        pos1=(pos1+180)*Math.PI/180;
        pos2=(pos2+180)*Math.PI/180;

    } else if (ctx === ctxHS2t) { // handstroke up
        pos1=(pos1-180)*Math.PI/180;
        pos2=(pos2-180)*Math.PI/180;

    } else if (ctx === ctxBS1t) { // backstroke down
        pos1=(180-pos1)*Math.PI/180;
        pos2=(180-pos2)*Math.PI/180;

    } else if (ctx === ctxBS2t) { // backstroke up
        pos1=(180-pos1)*Math.PI/180;
        pos2=(180-pos2)*Math.PI/180;
    }
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.rotate(pos1);
    ctx.moveTo(0, 0.15*radius);
    ctx.lineTo(0, (0.15*radius)+length);
    ctx.rotate(pos2-pos1);
    ctx.arc(0,0,(0.15*radius)+length,(0.5*Math.PI)-(pos2-pos1),(0.5*Math.PI),false);
//    ctx.lineTo(0, length);
    ctx.lineTo(0, 0.15*radius);
    ctx.rotate(-pos2);
    ctx.fillStyle="rgba(240,240,0,0.6)";
    ctx.fill();

}

function drawTDCs(){

    drawTarget();

    var stepSize = (BDwidth * 1.0)/(ROIL-ROIU); // this is how much the position needs to be scaled
    var zero = (0-ROIU) * stepSize;
    var currentStep = null;
    var angleJump = null;

    ctxBDt.font = "12px sans serif";
    ctxBDt.fillStyle = "rgb(255,100,100)";
    ctxBDt.textAlign = "center";
    ctxBDt.textBaseline="bottom";
    ctxBDt.fillText("TDC", posBS2 + BDwidth - zero, ctxBDt.canvas.height);
    ctxBDt.fillText("TDC", posHS1 + zero, ctxBDt.canvas.height);
    ctxBDt.fillText("TDC", posHS2 + BDwidth - zero, ctxBDt.canvas.height);
    ctxBDt.fillText("TDC", posBS1 + zero, ctxBDt.canvas.height);
    ctxBDt.fillText(ROIU.toString(), posHS1, ctxBDt.canvas.height);
    ctxBDt.fillText(ROIU.toString(), posBS1, ctxBDt.canvas.height);
//    ctxBDt.fillText(ROIL.toString(), posBS1, ctxBDt.canvas.height);
//    ctxBDt.fillText(ROIL.toString(), posHS1 + BDwidth, ctxBDt.canvas.height);
//    ctxBDt.fillText(ROIL.toString(), posHS2, ctxBDt.canvas.height);
//    ctxBDt.fillText(ROIL.toString(), posBS1 + BDwidth, ctxBDt.canvas.height);
    ctxBDt.beginPath();
    ctxBDt.strokeStyle = "rgb(255,100,100)";
    ctxBDt.moveTo(posHS1, ctxBDt.canvas.height - 16);
    ctxBDt.lineTo(posHS1, 14);
    ctxBDt.moveTo(posBS1, ctxBDt.canvas.height - 16);
    ctxBDt.lineTo(posBS1, 14);
    
    ctxBDt.moveTo(posBS2 + BDwidth - zero, ctxBDt.canvas.height - 16);
    ctxBDt.lineTo(posBS2 + BDwidth - zero, ctxBDt.canvas.height * 0.7);
    ctxBDt.moveTo(posHS1 + zero, ctxBDt.canvas.height -16);
    ctxBDt.lineTo(posHS1 + zero, ctxBDt.canvas.height * 0.7);
    ctxBDt.moveTo(posHS2 + BDwidth - zero, ctxBDt.canvas.height - 16);
    ctxBDt.lineTo(posHS2 + BDwidth - zero, ctxBDt.canvas.height * 0.7);
    ctxBDt.moveTo(posBS1 + zero, ctxBDt.canvas.height - 16);
    ctxBDt.lineTo(posBS1 + zero, ctxBDt.canvas.height * 0.7);
    ctxBDt.stroke();

    
    if (ROIL-ROIU >=60){
        angleJump=20;
        currentStep=20;
    } else {
        angleJump=10;
        currentStep=10;
    }
    ctxBDt.beginPath();
    ctxBDt.strokeStyle = "rgb(255,100,100)";
    while (currentStep < ROIL){
        ctxBDt.fillText(currentStep.toString(), posBS2 + BDwidth - zero - (currentStep * stepSize), ctxBDt.canvas.height);
        ctxBDt.moveTo(posBS2 + BDwidth - zero - (currentStep * stepSize), ctxBDt.canvas.height - 16);
        ctxBDt.lineTo(posBS2 + BDwidth - zero - (currentStep * stepSize), ctxBDt.canvas.height * 0.7);

        ctxBDt.fillText(currentStep.toString(), posHS1 + zero + (currentStep * stepSize), ctxBDt.canvas.height);
        ctxBDt.moveTo(posHS1 + zero + (currentStep * stepSize), ctxBDt.canvas.height -16);
        ctxBDt.lineTo(posHS1 + zero + (currentStep * stepSize), ctxBDt.canvas.height * 0.7);

        ctxBDt.fillText(currentStep.toString(), posHS2 + BDwidth - zero - (currentStep * stepSize), ctxBDt.canvas.height);
        ctxBDt.moveTo(posHS2 + BDwidth - zero - (currentStep * stepSize), ctxBDt.canvas.height - 16);
        ctxBDt.lineTo(posHS2 + BDwidth - zero - (currentStep * stepSize), ctxBDt.canvas.height * 0.7);

        ctxBDt.fillText(currentStep.toString(), posBS1 + zero + (currentStep * stepSize), ctxBDt.canvas.height);
        ctxBDt.moveTo(posBS1 + zero + (currentStep * stepSize), ctxBDt.canvas.height -16);
        ctxBDt.lineTo(posBS1 + zero + (currentStep * stepSize), ctxBDt.canvas.height * 0.7);

        currentStep+=angleJump;
    }
    ctxBDt.stroke();
        
    ctxBDt.textAlign = "start";
    ctxBDt.textBaseline="alphabetic";

}

function drawTarget(){
    var stepSize = (BDwidth * 1.0)/(ROIL-ROIU);
    var zero = (0-ROIU) * stepSize;

    if (targetAngleHand !== null && targetAngleHand >= ROIU  && targetAngleHand <= ROIL) {
        ctxBDt.beginPath();
        ctxBDt.lineWidth=4;
        ctxBDt.strokeStyle="rgba(0,240,0,0.9)";
        
        ctxBDt.moveTo((BDwidth - zero)-(targetAngleHand * stepSize),14);
        ctxBDt.lineTo((BDwidth - zero)-(targetAngleHand * stepSize), ctxBD.canvas.height-26);

        ctxBDt.moveTo((BDwidth + zero) + (targetAngleHand * stepSize),14);
        ctxBDt.lineTo((BDwidth + zero) + (targetAngleHand * stepSize), ctxBDt.canvas.height-26);
       
        ctxBDt.stroke();
        ctxBDt.lineWidth=1;
    }
    
    if (targetAngleBack !== null && targetAngleBack >= ROIU  && targetAngleBack <= ROIL) {
        ctxBDt.beginPath();
        ctxBDt.lineWidth=4;
        ctxBDt.strokeStyle="rgba(0,240,0,0.9)";
        
        ctxBDt.moveTo(posHS2 + (BDwidth-zero)-(targetAngleBack * stepSize),14);
        ctxBDt.lineTo(posHS2 + (BDwidth-zero)-(targetAngleBack * stepSize), ctxBD.canvas.height-26);

        ctxBDt.moveTo(posHS2 + (BDwidth + zero) + (targetAngleBack * stepSize),14);
        ctxBDt.lineTo(posHS2 + (BDwidth + zero) + (targetAngleBack * stepSize), ctxBDt.canvas.height-26);
       
        ctxBDt.stroke();
        ctxBDt.lineWidth=1;
    }
 }

function preventZoom(e) {
    var t2 = e.timeStamp;
    var t1 = e.currentTarget.dataset.lastTouch || t2;
    var dt = t2 - t1;
    var fingers = e.touches.length;
    e.currentTarget.dataset.lastTouch = t2;
    if (!dt || dt > 500 || fingers > 1) return; // not double-tap
    e.preventDefault();
    e.target.click();
}
