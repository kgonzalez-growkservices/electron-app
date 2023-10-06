import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;
let child: ChildProcessWithoutNullStreams;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send(
      'main-process-message',
      new Date().toLocaleString()
    );
  });

  if (VITE_DEV_SERVER_URL) {
    createServer();
    win?.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    createServer();
    win?.loadFile(path.join(process.env.DIST, 'index.html'));
  }
}

function createServer() {
  return new Promise<void>(async (res) => {
    if (VITE_DEV_SERVER_URL) {
      const jarPath = path.join(
        __dirname,
        '..',
        'spring-boot-0.0.1-SNAPSHOT.jar'
      );

      child = spawn('java', ['-jar', jarPath, '']);

      //If there's an error on the backend child process, log it
      child.on('error', (err) => {
        console.error('Error starting Java process:', err);
      });

      //If the child process exits, log it
      child.on('close', (code) => {
        if (code !== 0) {
          console.error('Java process exited with code', code);
        }
      });

      // Log stdout/stderr from the child process
      child.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });

      // Log stdout/stderr from the child process
      child.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });
    } else {
      const jarPath = path.join(
        process.resourcesPath,
        'spring-boot-0.0.1-SNAPSHOT.jar'
      );
      console.log({ jarPath });
      child = spawn('java', ['-jar', jarPath, '']);
    }

    child.stdout.on('error', (data) => {
      console.error(data.toString());
    });
    const maxRetries: number = 10;
    const msPerRetry: number = 1000;
    for (let currRetry = 0; currRetry < maxRetries; currRetry++) {
      const data = await fetch(
        'http://localhost:8080/actuator/health'
      )
        .then((response) => response.json())
        .catch(() => undefined);

      if (data?.status === 'UP') {
        win?.webContents.send('backend-started');
        return res();
      }
      await new Promise((delayRes) =>
        setTimeout(delayRes, msPerRetry)
      );
    }
    win?.webContents.send('backend-start-error');
    return res();
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  app.quit();
  win = null;
  child?.kill('SIGINT');
});

app.on('quit', () => {
  win = null;
  child?.kill('SIGINT');
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
