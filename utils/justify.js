/**
 *
 * the module responsible for the justification service
 *
 * @type {{justifyText: (function(string, number): string)}}
 */

const justify = {
    justifyText: (str, len) => {
        let re = RegExp("(?:\\s|^)(.{1," + len + "})(?=\\s|$)", "g");
        let res = [];
        let finalResult = [];

        while ((m = re.exec(str)) !== null) {
            res.push(m[1]);
        }
        for (let i = 0; i < res.length - 1; i++) {
            if (res[i].indexOf(' ') !== -1) {
                while (res[i].length < len) {
                    for (let j = 0; j < res[i].length - 1; j++) {
                        if (res[i][j] === ' ') {
                            res[i] = res[i].substring(0, j) + " " + res[i].substring(j);
                            if (res[i].length === len) break;
                            while (res[i][j] === ' ') j++;
                        }
                    }
                }
            }
            finalResult.push(res[i]);
        }

        finalResult.push(res[res.length - 1]);
        return finalResult.join('\n');

    }
};
module.exports = justify;