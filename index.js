const sftp = require("ssh2-sftp-client");
const fs = require("fs")

/** @type {import("@types/hexo")} */
hexo.extend.deployer.register("sftp", async function(args) {
  if (!args.host || !args.user) {
    const help = [
      "You should argsure deployment settings in _config.yml first!",
      "",
      "Example:",
      "  deploy:",
      "    type: sftp",
      "    host: <host>",
      "    port: [port] # Default is 21",
      "    user: <user>",
      "    pass: <pass> # leave blank for paswordless connections",
      "    privateKey: [path/to/privateKey] # Optional",
      "    passphrase: [passphrase] # Optional",
      "    agent: [path/to/agent/socket] # Optional, defaults to $SSH_AUTH_SOCK",
      "    remotePath: [remotePath] # Default is `/var/www/html`",
      "",
      "For more help, you can check the docs: " +
        "https://hexo.io/docs/one-command-deployment",
    ];

    console.log(help.join("\n"));
    return;
  }

  const config = {
    host: args.host,
    port: args.port || 22,
    username: args.user,
    password: args.pass,
    privateKey: args.privateKey && fs.readFileSync(args.privateKey),
    passphrase: args.passphrase,
    agent: args.agent || process.env.SSH_AUTH_SOCK,
  };

  let client = new sftp();
  await client.connect(config);
  await client.uploadDir(hexo.public_dir, args.remotePath || "/var/www/html");
});
