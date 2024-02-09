const colorPickerInput = document.getElementById("colorPickerInput");
const resultColorElement = document.getElementById("colorResult");
const copyButton = document.getElementById("copyButton");
const colorResultRGB = document.getElementById("colorResultRGB");
const copyButtonRGB = document.getElementById("copyButtonRGB");
const colorList = document.getElementById("colorList");
const actionButtons = document.getElementsByClassName('actionButtons');
const testColorCode = document.getElementById('testColorCode');
const testColorCodeInput = document.getElementById('testColorCodeInput');
const colorToBeConverted = document.getElementById('colorToBeConverted');
const convertColorButton = document.getElementById('convertColorButton');
const convertedColor = document.getElementById("convertedColor");

//load recent colors 
loadRecentColorsInDOM();

colorPickerInput.addEventListener('blur', refocus);

colorPickerInput.addEventListener('input', (e)=> {
    let color = e.target.value;
    // console.log("input hit", color);
    if(color.includes('#')){
        resultColorElement.innerText = color;
        colorResultRGB.innerText = hexToRgb(color);
        resultColorElement.style.backgroundColor = color;
        colorResultRGB.style.backgroundColor = color
    }else {
        const {r,g,b,a} = rgbStringToNumbers(color);
        colorResultRGB.innerText = color;
        color = rgbToHex(r,g,b,a);
        // console.log(color);
        resultColorElement.style.innerText = color;
        resultColorElement.style.backgroundColor = color;
        colorResultRGB.style.backgroundColor = color;
    }
});


Array(...actionButtons).forEach((element, idx) => {
    element.addEventListener('click', () => {
        const color = element.getAttribute('data');
        navigator.clipboard.writeText(color);
        notifyUser({
            title : color,
            body : "Color has been copied to clipboard",
            icon : "../images/pallate.png"
        });
    })
})

testColorCodeInput.addEventListener('keyup', () => {
    console.log(testColorCodeInput.value);
    testColorCode.style.backgroundColor = testColorCodeInput.value;
})

convertColorButton.addEventListener('click', () => {
    console.log("here");
    const algo = document.querySelector('input[name="colorradio"]:checked').value;
    const color = colorToBeConverted.value;
    let colorStr = '';
    console.log(algo);

    if(algo == 'hextorgb') {
        colorStr = hexToRgb(color);
    }else if(algo == 'rgbtohex') {
        let {r,g,b,a} = rgbStringToNumbers(color);
        colorStr = rgbToHex(r,g,b,a);
    }

    convertedColor.innerText = colorStr;

})

convertedColor.addEventListener('click', () => {
    const color = convertedColor.innerText;
    navigator.clipboard.writeText(color);
    notifyUser({
        title : color,
        body : "Color has been copied to clipboard",
        icon : "../images/pallate.png"
    });
})

copyButton.addEventListener('click', copyColorFunction);

resultColorElement.addEventListener('click', copyColorFunction);

colorResultRGB.addEventListener('click', () => copyColorFunction({isRgb: true}));

copyButtonRGB.addEventListener('click', () => copyColorFunction({isRgb: true}));

function copyColorFunction({isRgb = false}) {
    try {
        // console.log(isRgb);
        const color = isRgb 
            ? colorResultRGB.innerText
            : resultColorElement.innerText;
        navigator.clipboard.writeText(color)
        notifyUser({
            title : color,
            body : "Color has been copied to clipboard",
            icon : "../images/pallate.png"
        });
        let recentColors = localStorage.getItem('recentColors');
        if(recentColors) {
            recentColors = JSON.parse(recentColors);
        }else {
            recentColors = [];
        }


        if(isRgb) {
            var {r,g,b,a} = rgbStringToNumbers(color);
        }

        const colorObj = {
            'hex' : isRgb ? rgbToHex(r,g,b,a) : color,
            'rgb' : isRgb ? color : hexToRgb(color), 
        }

        let isPresent = false;
        recentColors.forEach(element => {
            console.log(element);
            if(element.hex == color || element.rgb == color) {
                isPresent = true;
            }
        });
        if(!isPresent){
            recentColors.push(colorObj);
            localStorage.setItem('recentColors', JSON.stringify(recentColors));
            const newColor = colorItemElement(colorObj);
            colorList.innerHTML = newColor + colorList.innerHTML;
        }

    } catch (error) {
        console.error(error);
    }
}

// colorPickerInput.showPickers();

function refocus(e) {
    // console.log(e);
    // colorPickerInput.showPicker();
}

//notification

function notifyUser({title, icon, body, onClick}) {
    if (Notification.permission !== 'granted'){
        // console.log("request notification access");
        Notification.requestPermission();
    }
    else {
        // console.log("creating new notification");
        var notification = new Notification(
            title, {
                icon: (icon) ? icon : 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
                body: (body) ? body : 'Hey there! You\'ve been notified!',
            }
        );
        notification.onclick =  onClick ? onClick :  () => {};
    }}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `rgb(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)})` : 'rgb(0,0,0)';
}

function componentToHex(c) {
    var hex = Number(c).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = Number(x).toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }).join('')
}

//rgb || rgba string to numbers

function rgbStringToNumbers(str) {
    str = str.split('(')[1];
    str = str.split(')')[0];
    const [r,g,b,a] = str.split(',');
    return {
        r,g,b,a
    }
}
// let {r,g,b,a} = rgbStringToNumbers('rgba(255,0,0)');
// console.log(rgbToHex(r,g,b,a));
// console.log(rgbStringToNumbers('rgb(23,44,25)'));

function getRecentColors() {
    let recentColors = localStorage.getItem('recentColors');
    if(!recentColors) {
        recentColors = '[]';
    }

    return JSON.parse(recentColors);
}


function loadRecentColorsInDOM() {
    const recentColors = getRecentColors().reverse();
    let elementString = '';
    recentColors.forEach(color => {
        elementString += colorItemElement({hex: color.hex, rgb: color.rgb});
    });
    colorList.innerHTML = '';
    colorList.innerHTML = elementString;
}

function colorItemElement({hex, rgb}) {
    const colorItem = `
        <div class="colorItem">
            <div style="background-color: ${hex}" class="color">
                <span>${hex}</span>
                <span>${rgb}</span> 
            </div>
            <div class="sizedbox"></div>
            <div class="actions">
                <img data="${hex}" class="actionButtons" src="../images/hexCode.png" alt="">
                <img data="${rgb}" class="actionButtons" src="../images/rgbCode.png" alt="">
            </div>
        </div>
    `
    return colorItem;
}