const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const command = process.argv[2];

function resolveAdb() {
    const localAppData = process.env.LOCALAPPDATA;

    if (localAppData) {
        const sdkAdb = path.join(
            localAppData,
            "Android",
            "Sdk",
            "platform-tools",
            process.platform === "win32" ? "adb.exe" : "adb"
        );

        if (fs.existsSync(sdkAdb)) {
            return sdkAdb;
        }
    }

    return "adb";
}

function runAdb(args) {
    execFileSync(resolveAdb(), args, { stdio: "inherit" });
}

if (command === "reverse") {
    runAdb(["reverse", "tcp:8090", "tcp:8090"]);
    runAdb(["reverse", "tcp:8081", "tcp:8081"]);
} else if (command === "open") {
    runAdb([
        "shell",
        "am",
        "start",
        "-a",
        "android.intent.action.VIEW",
        "-d",
        "exp://127.0.0.1:8090/--/",
        "host.exp.exponent",
    ]);
} else {
    console.error("Usage: node scripts/phone-usb.js <reverse|open>");
    process.exit(1);
}
