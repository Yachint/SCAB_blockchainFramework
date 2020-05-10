const callFramework = () => {
    console.log("Called !");
    setTimeout(timer, 500);
}

const timer = () => {
    setTimeout(callFramework,500);
}

timer();