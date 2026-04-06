
let equation;

document.getElementById("mySubmit").onclick = onSubmit;
document.getElementById("input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();   // prevents form submission/page reload
        onSubmit();
    }
});

function onSubmit() {
    const ogEquation = document.getElementById("input").value;
    console.log("Equation entered: ", ogEquation);
    if (/^[+-]?\d+(\.\d+)?$/.test(ogEquation)) {
        outputResults(ogEquation, "0");
        return;
    }

    let derivative = "";
const equationType = equationTypeChecker(ogEquation);

if (equationType === "product") {
    derivative = doProductRule(ogEquation);
    outputResults(ogEquation, derivative);
} else if (equationType === "quotient") {
    const quotientDerivative = doQuotientRule(ogEquation);
    outputResults(ogEquation, quotientDerivative);
} else {
    const terms = splitEquation(ogEquation);
    derivative = differentiate(terms);
    derivative = formatDerivative(derivative);
    outputResults(ogEquation, derivative);
}

    function equationTypeChecker(equation) {
        let equationType = "";
        if (equation.includes(")/(")) {
            equationType = "quotient";
        } else if (equation.includes(")(")) {
            equationType = "product";
        } else {
            equationType = "polynomial";
        }
        return equationType;
    }
    
    function splitEquation(equation) {
        let newPoly = equation.replace(/ /g, "")
            .replace(/\(/g, "").replace(/\)/g, "");
        newPoly = newPoly.replace(/x\^-/g, "x~");
    
        let terms = newPoly.split(/(?=[+-])/);
    
        for (let i = 0; i < terms.length; i++) {
            terms[i] = terms[i].replace(/~/g, "-");
        }
        return terms;
    }
    
    function differentiate(terms) {
        let derivative = "";
        for (const term of terms) {
            if (term.includes("x")) {
                const parsedTerm = parseTerm(term);
                const coeff = parsedTerm[0];
                const exponent = parsedTerm[1];
                const differentiatedTerm = powerRule(coeff, exponent);
                derivative += differentiatedTerm;
            } else {
                continue;
            }
        }
        return derivative;
    }
    function parseTerm(term) {
        let coeffStr;
        let expStr;
        let temp = term.split(/x\^?/);

        if (temp[0] === "" || temp[0] === "+") {
            coeffStr = "1";
        } else if (temp[0] === "-") {
            coeffStr = "-1";
        } else {
            coeffStr = temp[0];
        }
    
        if (temp.length > 1 && temp[1] !== "") {
            expStr = temp[1];
        } else {
            expStr = "1";
        }
    
        return [parseFloat(coeffStr), parseFloat(expStr)];
    }
    
    function powerRule(coeff, exponent) {
        function formatNumber(num) {
            return num.toFixed(2).replace(/\.?0+$/, '');
        }
    
        let Dcoeff = coeff * exponent;
        let Dexponent = exponent - 1;
    
        let operator = Dcoeff < 0 ? '-' : '+';
    
        Dcoeff = Math.abs(Dcoeff);
    
        let finalTerm = "";
        if (Dexponent === 0) {
            finalTerm = operator + " " + formatNumber(Dcoeff) + " ";
        } else if (Dexponent === 1) {
            finalTerm = operator + " " + formatNumber(Dcoeff) + "x ";
        } else {
            finalTerm = operator + " " + formatNumber(Dcoeff) + "x^" + formatNumber(Dexponent) + " ";
        }
        return finalTerm;
    }
    
    function formatDerivative(derivative) {
        if (derivative.startsWith(" +")) {
            derivative = derivative.substring(3);
        } else if (derivative.startsWith("+")) {
            derivative = derivative.substring(2);
        } else if (derivative.startsWith(" -")) {
            derivative = derivative.substring(3);
            derivative = "-" + derivative;
        } else if (derivative.startsWith("-")) {
            derivative = derivative.substring(2);
            derivative = "-" + derivative;
        }
        derivative = derivative.substring(0, derivative.length - 1);
        return derivative;
    }
    function outputResults(originalTerm, result) {
        const outputDiv = document.getElementById("output");

        const formattedText = `
        <p>f(x)=${originalTerm}</p>
        <p>f'(x)= ${result}</p>`;
        outputDiv.innerHTML = formattedText;

    }
    
    function doProductRule(equation) {
        const productList = productSplitter(equation);
        let derivative = "";
        const productDerivList = [];
        for (let i = 0; i < productList.length; i++) {
            const terms = splitEquation(productList[i]);
            derivative = differentiate(terms);
            derivative = formatDerivative(derivative);
            productDerivList.push(derivative);
        }
        const derivListArr = productDerivList;
        let finalTerm = "";
        for (let i = 0; i < productList.length; i++) {
            if (finalTerm !== "") {
                finalTerm += " + ";
            }
            finalTerm += buildProduct(productList, derivListArr, i);
        }
        return finalTerm;
    }
    
    function productSplitter(equation) {
        let productList = equation.split(/\)\(/);
        productList = productList.map(item => item.replace(/\(/g, "").replace(/\)/g, ""));
        return productList;
    }
    
    function buildProduct(productList, derivListArr, i) {
        let term = "";
        for (let j = 0; j < productList.length; j++) {
            if (j === i) {
                term += "(" + derivListArr[j] + ")";
            } else {
                term += "(" + productList[j] + ")";
            }
        }
        return term;
    }
    
    function doQuotientRule(equation) {
        const quotientList = equation.split(/\)\/\(/);
        const numerator = quotientList[0];
    
        const numType = equationTypeChecker(numerator);
        let numDerivative = "";
        if (numType === "product") {
            numDerivative = doProductRule(numerator);
        } else {
            const terms = splitEquation(numerator);
            numDerivative = differentiate(terms);
            numDerivative = formatDerivative(numDerivative);
        }
    
        const denominator = quotientList[1];
        const denomType = equationTypeChecker(denominator);
        let denomDerivative = "";
        if (denomType === "product") {
            denomDerivative = doProductRule(denominator);
        } else {
            const terms = splitEquation(denominator);
            denomDerivative = differentiate(terms);
            denomDerivative = formatDerivative(denomDerivative);
        }
        const quotientDerivative = quotientFormatter(numerator, numDerivative, denominator, denomDerivative);
        return quotientDerivative;
    }
    
    function quotientFormatter(numerator, numDerivative, denominator, denomDerivative) {
        numerator = stripParens(numerator);
        // numDerivative = stripParens(numDerivative);
        denominator = stripParens(denominator);
        // denomDerivative = stripParens(denomDerivative);
    
        const quotientDerivative = "(" + denominator + ")" + "(" + numDerivative + ")-(" +
            numerator + ")" + "(" + denomDerivative + ") / (" + denominator + ")^2";
        return quotientDerivative;
    }
    
    function stripParens(equation) {
        if (equation.startsWith("(")) {
            equation = equation.substring(1);
        }
        if (equation.endsWith(")")) {
            equation = equation.substring(0, equation.length - 1);
        }
        return equation;
    }
}