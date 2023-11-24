const CUBE_TYPES_ENUM = {
    two: 0,
    four: 1,
    eight: 2,
    oneSix: 3,
    threeTwo: 4,
    sixFour: 5,
    oneTwoEight: 6,
    twoFiveSix: 7,
    fiveOneTwo: 8,
    oneZeroTwoFour: 9,
    twoZeroFourEight: 10,
    overFlow: 11,
};

class Cube {
    static enums = Object.values(CUBE_TYPES_ENUM);

    constructor(type, value, textColor, bgColor) {
        this.type = type;
        this.value = value;
        this.textColor = textColor;
        this.bgColor = bgColor;

        this.definedIndex = Cube.enums.indexOf(this.type);
    }

    getType() {
        return this.type;
    }

    getValue() {
        return this.value;
    }

    getTextColor() {
        return this.textColor;
    }

    getBgColor() {
        return this.bgColor;
    }

    upgradeCube() {
        this.type = cubesByType[this.getIndexOfUpgrade()].getType();
        this.value = cubesByType[this.getIndexOfUpgrade()].getValue();
        this.textColor = cubesByType[this.getIndexOfUpgrade()].getTextColor();
        this.bgColor = cubesByType[this.getIndexOfUpgrade()].getBgColor();
    }

    getUpgradedCube() {
        const upgradedCube = cubesByType[this.getIndexOfUpgrade()];

        if (upgradedCube.getType() !== CUBE_TYPES_ENUM.overFlow)
            return upgradedCube;
        else
            return new Cube(
                this.getType(),
                parseInt(this.getValue()) * 2,
                this.getTextColor(),
                this.getBgColor()
            );
    }

    getIndexOfUpgrade() {
        const beforeLastEnumIndex = Cube.enums.length - 1;

        if (this.definedIndex == beforeLastEnumIndex)
            return beforeLastEnumIndex;

        return this.definedIndex + 1;
    }
}

const cubesByType = [
    new Cube(CUBE_TYPES_ENUM.two, "2", "color-brand-800", "bg-cube-2"),
    new Cube(CUBE_TYPES_ENUM.four, "4", "color-brand-800", "bg-cube-4"),
    new Cube(CUBE_TYPES_ENUM.eight, "8", "text-white", "bg-cube-8"),
    new Cube(CUBE_TYPES_ENUM.oneSix, "16", "text-white", "bg-cube-16"),
    new Cube(CUBE_TYPES_ENUM.threeTwo, "32", "text-white", "bg-cube-32"),
    new Cube(CUBE_TYPES_ENUM.sixFour, "64", "text-white", "bg-cube-64"),
    new Cube(CUBE_TYPES_ENUM.oneTwoEight, "128", "text-white", "bg-cube-128"),
    new Cube(CUBE_TYPES_ENUM.twoFiveSix, "256", "text-white", "bg-cube-256"),
    new Cube(CUBE_TYPES_ENUM.fiveOneTwo, "512", "text-white", "bg-cube-512"),
    new Cube(
        CUBE_TYPES_ENUM.oneZeroTwoFour,
        "1024",
        "text-white",
        "bg-cube-1024"
    ),
    new Cube(
        CUBE_TYPES_ENUM.twoZeroFourEight,
        "2048",
        "text-white",
        "bg-cube-2048"
    ),
    new Cube(
        CUBE_TYPES_ENUM.overFlow,
        "MATH",
        "text-white",
        "bg-cube-overflow"
    ),
];

const cubeDomDefaultClassList =
    "col w-25 h-100 d-flex justify-content-center align-items-center fs-1 fw-bold ";
