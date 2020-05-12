(function() {
    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.

    var width = 320; // We will scale the photo width to this
    var height = 0; // This will be computed based on the input stream

    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.

    var streaming = false;

    // The various HTML elements we need to configure or control. These
    // will be set by the startup() function.

    var video = null;
    var canvas = null;
    var photo = null;
    var startbutton = null;
    var imageLink = null;


    function startup() {
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        photo = document.getElementById('photo');
        startbutton = document.getElementById('startbutton');
        imageLink = document.getElementById('imageLink');

        navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            })
            .then(function(stream) {
                video.srcObject = stream;
                video.play();
            })
            .catch(function(err) {
                console.log("An error occurred: " + err);
            });

        video.addEventListener('canplay', function(ev) {
            if (!streaming) {
                height = video.videoHeight / (video.videoWidth / width);

                // Firefox currently has a bug where the height can't be read from
                // the video, so we will make assumptions if this happens.

                if (isNaN(height)) {
                    height = width / (4 / 3);
                }

                video.setAttribute('width', width);
                video.setAttribute('height', height);
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                streaming = true;
            }
        }, false);

        startbutton.addEventListener('click', function(ev) {
            takepicture();
            ev.preventDefault();
        }, false);

        clearphoto();
    }

    // Fill the photo with an indication that none has been
    // captured.

    function clearphoto() {
        var context = canvas.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        var data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
    }

    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.

    function takepicture() {
        var context = canvas.getContext('2d');
        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);


            var data = canvas.toDataURL('image/png');
            photo.setAttribute('src', data);

            var base64 = canvas.toDataURL();
            imageLink.setAttribute('href', base64);

        } else {
            clearphoto();
        }
    }

    // Set up our event listener to run the startup process
    // once loading is complete.
    window.addEventListener('load', startup, false);
})();


document.getElementById("agebutton").addEventListener("click", function(event) {
    ProcessImage();
}, false);

function LoadImage() {
    imagedata = {
        "img": imageLink.href.split(',')[1]
    }

    $.ajax({
        url: '/saveFile',
        type: 'post',
        data: JSON.stringify(imagedata),
        dataType: 'json',
        contentType: 'application/json',
        success: function(data) {
            console.log(data)
        },
        error: function(data) {
            console.log(data)
        },

    });

}



//Loads selected image and unencodes image bytes for Rekognition DetectFaces API
function ProcessImage() {
    AnonLog();

    var img = document.getElementById('photo');
    image = atob(img.src.split(',')[1])

    var length = image.length;
    imageBytes = new ArrayBuffer(length);
    var ua = new Uint8Array(imageBytes);
    for (var i = 0; i < length; i++) {
        ua[i] = image.charCodeAt(i);
    }
    //Call Rekognition  
    DetectFaces(imageBytes);
}

//Provides anonymous log on to AWS services
function AnonLog() {


    AWS.config.region = 'us-east-1'; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:6cdffc3c--8fa67d3bafe6',
    });

    AWS.config.credentials.get(function() {

        var accessKeyId = AWS.config.credentials.accessKeyId;
        var secretAccessKey = AWS.config.credentials.secretAccessKey;
        var sessionToken = AWS.config.credentials.sessionToken;
    });
}


//Calls DetectFaces API and shows estimated ages of detected faces
function DetectFaces(imageData) {
    AWS.region = "us-east-1";
    var rekognition = new AWS.Rekognition();

    var params = {
        Image: {
            Bytes: imageData
        },
        Attributes: [
            'ALL',
        ]
    }

    rekognition.detectFaces(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            var val = "<h4> Your age is between ";
            
            for (var i = 0; i < data.FaceDetails.length; i++) {
                 val +=     data.FaceDetails[i].AgeRange.Low + ' and ' + data.FaceDetails[i].AgeRange.High
            }
            val += ".</h4>";
            document.getElementById("label").innerHTML = val;
        }
    });


};