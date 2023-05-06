const videoEle = document.getElementById('video')
const button = document.getElementById('button')

async function selectMediaStream(){
    try {
        const mediaStream = await navigator.mediaDevices.getDisplayMedia()
        videoEle.srcObject = mediaStream
        videoEle.onloadedmetadata = () =>{
            videoEle.play()
        }  
    } catch (error) {
        console.log(error, 'error here');
    }
}

button.addEventListener('click' , async function(){
   
    await videoEle.requestPictureInPicture()
   
})

selectMediaStream()