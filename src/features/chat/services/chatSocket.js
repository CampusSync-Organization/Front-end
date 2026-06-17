const WS_URL = "wss://back-end-production-7229.up.railway.app/ws/chat";
const MIN_RECONNECT_DELAY = 1000;
const MAX_RECONNECT_DELAY = 30000;

class ChatSocket {
  constructor() {
    this.socket = null;
    this.handlers = [];
    this.reconnectDelay = MIN_RECONNECT_DELAY;
    this.token = null;
    this.shouldReconnect = false;
    this._reconnectTimer = null;
  }

  connect(token) {
    this.token = token;
    this.shouldReconnect = true;
    this._open();
  }

  _open() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.socket = new WebSocket(`${WS_URL}?token=${this.token}`);

    this.socket.onopen = () => {
      this.reconnectDelay = MIN_RECONNECT_DELAY;
    };

    this.socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.type === "message" && parsed.data) {
          this.handlers.forEach((handler) => handler(parsed.data));
        }
      } catch {
        // ignore malformed messages
      }
    };

    this.socket.onclose = () => {
      if (!this.shouldReconnect) return;
      this._reconnectTimer = setTimeout(() => {
        this.reconnectDelay = Math.min(this.reconnectDelay * 2, MAX_RECONNECT_DELAY);
        this._open();
      }, this.reconnectDelay);
    };

    this.socket.onerror = () => {
      this.socket.close();
    };
  }

  disconnect() {
    this.shouldReconnect = false;
    if (this._reconnectTimer) {
      clearTimeout(this._reconnectTimer);
      this._reconnectTimer = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.handlers = [];
  }

  send(roomId, content) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket not connected");
    }
    this.socket.send(JSON.stringify({ room_id: roomId, content }));
  }

  onMessage(handler) {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter((h) => h !== handler);
    };
  }

  get isConnected() {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }
}

export const chatSocket = new ChatSocket();
