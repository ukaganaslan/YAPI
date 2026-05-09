import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { messagesAPI, getUser } from '../utils/api';

/* ── helpers ─────────────────────────────────────────────────────────────── */
function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  if (diff < 60_000) return 'Just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function Avatar({ name, size = 40, color = '#2563EB' }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize: size * 0.38,
        flexShrink: 0,
      }}
    >
      {(name || '?').charAt(0).toUpperCase()}
    </div>
  );
}

/* ── ConversationItem ────────────────────────────────────────────────────── */
function ConversationItem({ conv, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        background: active ? 'rgba(37,99,235,0.08)' : 'transparent',
        border: 'none',
        borderLeft: active ? '3px solid #2563EB' : '3px solid transparent',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
    >
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <Avatar name={conv.partnerName} size={44} color={active ? '#2563EB' : '#64748B'} />
        {conv.unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: -2, right: -2,
            background: '#EF4444', color: '#fff',
            borderRadius: '50%', width: 18, height: 18,
            fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #fff',
          }}>
            {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
          </span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 130 }}>
            {conv.partnerName || 'Partner'}
          </span>
          <span style={{ fontSize: 11, color: '#94A3B8', flexShrink: 0, marginLeft: 4 }}>
            {formatTime(conv.lastMessage?.createdAt)}
          </span>
        </div>
        <p style={{ fontSize: 12, color: '#64748B', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {conv.lastMessage
            ? `${conv.lastMessage.fromMe ? 'You: ' : ''}${conv.lastMessage.content}`
            : <em style={{ color: '#94A3B8' }}>No messages yet</em>}
        </p>
        <p style={{ fontSize: 11, color: '#2563EB', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          📌 {conv.postTitle}
        </p>
      </div>
    </button>
  );
}

/* ── ChatBubble ──────────────────────────────────────────────────────────── */
function ChatBubble({ msg, isMe }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: isMe ? 'flex-end' : 'flex-start',
      marginBottom: 8,
    }}>
      <div style={{
        maxWidth: '70%',
        padding: '10px 14px',
        borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isMe
          ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)'
          : '#F1F5F9',
        color: isMe ? '#fff' : '#1E293B',
        fontSize: 14,
        lineHeight: 1.5,
        boxShadow: isMe ? '0 2px 12px rgba(37,99,235,0.25)' : '0 1px 4px rgba(0,0,0,0.06)',
        wordBreak: 'break-word',
      }}>
        {msg.content}
        <div style={{
          fontSize: 10,
          marginTop: 4,
          opacity: 0.65,
          textAlign: 'right',
        }}>
          {formatTime(msg.createdAt)}
          {isMe && msg.readAt && (
            <span style={{ marginLeft: 4 }}>✓✓</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────────── */
export default function Messages() {
  const currentUser = getUser();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  /* fetch conversations */
  const loadConversations = useCallback(async () => {
    try {
      const data = await messagesAPI.getConversations();
      setConversations(data.conversations || []);
    } catch {
      /* silently ignore poll errors */
    } finally {
      setLoadingConvs(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
    pollRef.current = setInterval(loadConversations, 15_000);
    return () => clearInterval(pollRef.current);
  }, [loadConversations]);

  /* fetch messages for active conversation */
  const loadMessages = useCallback(async (conv) => {
    if (!conv) return;
    setLoadingMsgs(true);
    try {
      const data = await messagesAPI.getHistory(conv.postId, conv.partnerId);
      setMessages(data.messages || []);
      // refresh unread counts
      setConversations((prev) =>
        prev.map((c) =>
          c.postId === conv.postId && c.partnerId === conv.partnerId
            ? { ...c, unreadCount: 0 }
            : c
        )
      );
    } catch (err) {
      setError(err.message || 'Failed to load messages.');
    } finally {
      setLoadingMsgs(false);
    }
  }, []);

  useEffect(() => {
    loadMessages(activeConv);
  }, [activeConv, loadMessages]);

  /* scroll to bottom on new messages */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* poll messages every 5s when a conversation is open */
  useEffect(() => {
    if (!activeConv) return;
    const id = setInterval(async () => {
      try {
        const data = await messagesAPI.getHistory(activeConv.postId, activeConv.partnerId);
        setMessages(data.messages || []);
      } catch { /* ignore */ }
    }, 5_000);
    return () => clearInterval(id);
  }, [activeConv]);

  const handleSend = async () => {
    if (!draft.trim() || !activeConv || sending) return;
    setSending(true);
    try {
      await messagesAPI.send(activeConv.postId, activeConv.partnerId, draft.trim());
      setDraft('');
      await loadMessages(activeConv);
    } catch (err) {
      setError(err.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filtered = conversations.filter((c) =>
    !search || (c.partnerName || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.postTitle || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = conversations.reduce((s, c) => s + (c.unreadCount || 0), 0);

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh', background: '#F8FAFC' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>

        {/* Header */}
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width={22} height={22} fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0F172A' }}>
              Messages
              {totalUnread > 0 && (
                <span style={{
                  marginLeft: 10, background: '#EF4444', color: '#fff',
                  borderRadius: 99, padding: '2px 8px', fontSize: 12, fontWeight: 700,
                }}>
                  {totalUnread}
                </span>
              )}
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
              Only accessible between accepted project partners
            </p>
          </div>
        </div>

        {error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10,
            padding: '10px 14px', marginBottom: 16, color: '#DC2626', fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            {error}
            <button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', fontSize: 18 }}>×</button>
          </div>
        )}

        {/* Main layout */}
        <div style={{
          display: 'flex', gap: 0,
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          height: 'calc(100vh - 180px)',
          minHeight: 500,
        }}>

          {/* ── Sidebar ── */}
          <div style={{
            width: 300,
            flexShrink: 0,
            borderRight: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            background: '#FAFAFA',
          }}>
            {/* Search */}
            <div style={{ padding: '14px 14px 10px' }}>
              <div style={{ position: 'relative' }}>
                <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} width={15} height={15} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search conversations…"
                  style={{
                    width: '100%', paddingLeft: 32, paddingRight: 10, paddingTop: 8, paddingBottom: 8,
                    border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 13,
                    background: '#fff', color: '#0F172A', outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Conversations list */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {loadingConvs ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#94A3B8', fontSize: 13 }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
                  Loading conversations…
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#94A3B8' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#475569' }}>No conversations yet</p>
                  <p style={{ margin: '6px 0 0', fontSize: 12, lineHeight: 1.5 }}>
                    You can chat once a meeting request is accepted on a project.
                  </p>
                  <Link to="/dashboard" style={{ display: 'inline-block', marginTop: 14, padding: '7px 16px', background: '#2563EB', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
                    Browse Projects
                  </Link>
                </div>
              ) : (
                filtered.map((conv) => {
                  const key = `${conv.postId}-${conv.partnerId}`;
                  const isActive = activeConv && `${activeConv.postId}-${activeConv.partnerId}` === key;
                  return (
                    <ConversationItem
                      key={key}
                      conv={conv}
                      active={isActive}
                      onClick={() => { setActiveConv(conv); setMessages([]); }}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* ── Chat Panel ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {!activeConv ? (
              /* Empty state */
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16, fontSize: 36,
                }}>💬</div>
                <h3 style={{ margin: 0, fontSize: 16, color: '#475569', fontWeight: 600 }}>Select a conversation</h3>
                <p style={{ margin: '6px 0 0', fontSize: 13, textAlign: 'center', maxWidth: 280 }}>
                  Choose a partner from the list to start messaging.
                </p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid #E2E8F0',
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: '#fff',
                }}>
                  <Avatar name={activeConv.partnerName} size={40} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#0F172A' }}>
                      {activeConv.partnerName || 'Partner'}
                    </p>
                    <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
                      {activeConv.partnerEmail || ''} · {activeConv.partnerRole || ''}
                    </p>
                  </div>
                  <Link
                    to={`/post/${activeConv.postId}`}
                    style={{
                      fontSize: 12, color: '#2563EB', fontWeight: 600,
                      textDecoration: 'none', background: '#EFF6FF',
                      padding: '4px 10px', borderRadius: 8,
                      border: '1px solid #BFDBFE',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      maxWidth: 200,
                    }}
                  >
                    📌 {activeConv.postTitle}
                  </Link>
                </div>

                {/* Messages */}
                <div style={{
                  flex: 1, overflowY: 'auto', padding: '20px 20px 8px',
                  display: 'flex', flexDirection: 'column',
                }}>
                  {loadingMsgs ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#94A3B8', fontSize: 13 }}>Loading…</div>
                  ) : messages.length === 0 ? (
                    <div style={{ textAlign: 'center', margin: 'auto', color: '#94A3B8', fontSize: 13 }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>👋</div>
                      Say hello to {activeConv.partnerName?.split(' ')[0] || 'your partner'}!
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <ChatBubble
                        key={msg._id}
                        msg={msg}
                        isMe={msg.sender?.toString() === currentUser?._id?.toString() ||
                              msg.senderEmail === currentUser?.email}
                      />
                    ))
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div style={{
                  padding: '12px 16px',
                  borderTop: '1px solid #E2E8F0',
                  background: '#fff',
                  display: 'flex', gap: 10, alignItems: 'flex-end',
                }}>
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Type a message… (Enter to send)"
                    rows={1}
                    style={{
                      flex: 1, resize: 'none', padding: '10px 14px',
                      border: '1px solid #E2E8F0', borderRadius: 12,
                      fontSize: 14, fontFamily: 'inherit', color: '#0F172A',
                      background: '#F8FAFC', outline: 'none',
                      maxHeight: 120, lineHeight: 1.5,
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.10)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                    }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!draft.trim() || sending}
                    style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      background: draft.trim() && !sending
                        ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)'
                        : '#E2E8F0',
                      color: draft.trim() && !sending ? '#fff' : '#94A3B8',
                      border: 'none', cursor: draft.trim() && !sending ? 'pointer' : 'not-allowed',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s',
                      boxShadow: draft.trim() && !sending ? '0 2px 10px rgba(37,99,235,0.3)' : 'none',
                    }}
                  >
                    {sending ? (
                      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <circle cx={12} cy={12} r={10} strokeDasharray="31.4" strokeDashoffset="10">
                          <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
                        </circle>
                      </svg>
                    ) : (
                      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
