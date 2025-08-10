import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ChatList = ({ onOpenChat, onClose }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/chat/my-chats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setChats(data.data);
      } else {
        setError(data.message || 'Failed to fetch chats');
      }
    } catch (error) {
      setError('Failed to fetch chats. Please try again.');
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getLastMessage = (chat) => {
    if (chat.messages.length === 0) return 'No messages yet';
    const lastMessage = chat.messages[chat.messages.length - 1];
    return lastMessage.message.length > 50 
      ? lastMessage.message.substring(0, 50) + '...' 
      : lastMessage.message;
  };

  const getUnreadCount = (chat) => {
    return chat.messages.filter(msg => 
      msg.senderId !== user?.id && !msg.isRead
    ).length;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
          <div className="flex items-center justify-center">
            <svg className="w-8 h-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-3 text-gray-600">Loading chats...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h3 className="font-semibold">My Conversations</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {error && (
            <div className="p-4">
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
                {error}
              </div>
            </div>
          )}

          {chats.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-lg font-medium">No conversations yet</p>
              <p className="text-sm text-gray-400">Start chatting about products to see them here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {chats.map((chat) => {
                const unreadCount = getUnreadCount(chat);
                const isBuyer = chat.buyerId._id === user?.id;
                const otherUser = isBuyer ? chat.sellerId : chat.buyerId;
                
                return (
                  <div
                    key={chat._id}
                    onClick={() => onOpenChat(chat)}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={chat.productId.images?.[0] || '/placeholder-product.jpg'}
                          alt={chat.productId.name}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-200"
                        />
                      </div>

                      {/* Chat Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {chat.productId.name}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {formatTime(chat.lastMessageAt)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 truncate">
                          {isBuyer ? 'Seller: ' : 'Buyer: '}
                          {otherUser.name}
                        </p>
                        
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {getLastMessage(chat)}
                        </p>
                      </div>

                      {/* Unread Badge */}
                      {unreadCount > 0 && (
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                            {unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            {chats.length} conversation{chats.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatList; 