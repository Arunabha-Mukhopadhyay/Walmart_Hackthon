import React, { useState, useEffect } from 'react';
import { Send, Sparkles, Package, Plus, TrendingUp, ShoppingCart, CheckCircle } from 'lucide-react';
import DashboardNav from '../../../components/DashboardNav';
import Header from '../../../components/Header';

const AIAssistantTab = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hi! I\'m your AI Product Recommendation Assistant. I can help you:\n\n🔥 Get trending products that are popular online\n📦 Create new product categories\n🛒 Add recommended items to your purchase list\n\nTry asking: "What are the famous products we should stock?" or "Create a new Electronics category"',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quickActions] = useState([
    { label: 'Get Trending Products', action: 'trending' },
    { label: 'Create New Category', action: 'category' },
    { label: 'Seasonal Recommendations', action: 'seasonal' }
  ]);

  const handleQuickAction = (action) => {
    let message = '';
    switch(action) {
      case 'trending':
        message = 'What are the famous products that most people are buying online that we should stock in our store?';
        break;
      case 'category':
        message = 'Create a new Electronics category with popular tech products';
        break;
      case 'seasonal':
        message = 'What seasonal products should we stock for the current season?';
        break;
    }
    setInputText(message);
  };

  const processAIResponse = async (userMessage) => {
    setIsLoading(true);
    const API_BASE = import.meta.env.VITE_API_URL;;
    
    try {
      // Determine if it's a trending request or new category request
      const isTrending = userMessage.toLowerCase().includes('famous') || 
                        userMessage.toLowerCase().includes('trending') ||
                        userMessage.toLowerCase().includes('popular online');
      
      const isNewCategory = userMessage.toLowerCase().includes('create') && 
                           userMessage.toLowerCase().includes('category');

      let endpoint = `${API_BASE}/api/recommendations/chat`;
      let requestBody = { message: userMessage };

      if (isTrending) {
        endpoint = `${API_BASE}/api/recommendations/trending`;
        requestBody = {};
      } else if (isNewCategory) {
        // Extract category name from message
        const categoryMatch = userMessage.match(/create.*?(\w+)\s+category/i);
        if (categoryMatch) {
          endpoint = `${API_BASE}/api/recommendations/new-category`;
          requestBody = { categoryName: categoryMatch[1] };
        }
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      
      if (data.success) {
        let botResponse = formatAIResponse(data);
        setMessages(prev => [...prev, {
          type: 'bot',
          content: botResponse,
          timestamp: new Date(),
          data: data
        }]);
      } else {
        setMessages(prev => [...prev, {
          type: 'bot',
          content: `❌ Sorry, I encountered an error: ${data.error || 'Unknown error'}`,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: '❌ Sorry, I couldn\'t process your request. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAIResponse = (data) => {
    const { ai_response, database_results } = data;
    let response = '';

    if (ai_response.type === 'trending_recommendations') {
      response += `🔥 **${ai_response.message}**\n\n`;
      
      Object.entries(ai_response.categories).forEach(([categoryName, products]) => {
        response += `**${categoryName} (${products.length} items)**\n`;
        products.forEach((product, index) => {
          response += `${index + 1}. ${product.product_name} - $${product.price}\n`;
          response += `   📍 Shelf: ${product.shelf} | Stock: ${product.stock_quantity} units\n`;
          response += `   💡 ${product.trend_reason}\n\n`;
        });
      });
    } else if (ai_response.type === 'new_category') {
      response += `✨ **${ai_response.message}**\n\n`;
      response += `📂 **Category: ${ai_response.category_name}**\n\n`;
      
      ai_response.products.forEach((product, index) => {
        response += `${index + 1}. ${product.product_name} - $${product.price}\n`;
        response += `   📍 Shelf: ${product.shelf} | Stock: ${product.stock_quantity} units\n`;
        response += `   💡 ${product.trend_reason}\n\n`;
      });
    }

    // Add database results
    response += `\n🎯 **Action Results:**\n`;
    response += `✅ Products Added: ${database_results.products_added.length}\n`;
    response += `📂 Categories Created: ${database_results.categories_created.length}\n`;
    response += `🛒 Items Added to Purchase List: ${database_results.purchase_list_items.length}\n`;
    
    if (database_results.categories_created.length > 0) {
      response += `\n📂 New Categories: ${database_results.categories_created.join(', ')}`;
    }

    return response;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToProcess = inputText;
    setInputText('');

    await processAIResponse(messageToProcess);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
    <Header />
    <div className="min-h-screen bg-gray-50 p-6">
      <DashboardNav />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Product Assistant</h1>
              <p className="text-gray-600">Get trending product recommendations and manage inventory intelligently</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3 flex-wrap">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.action)}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                {action.action === 'trending' && <TrendingUp className="w-4 h-4" />}
                {action.action === 'category' && <Plus className="w-4 h-4" />}
                {action.action === 'seasonal' && <Package className="w-4 h-4" />}
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-lg shadow-sm border h-96 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="whitespace-pre-line text-sm">{message.content}</div>
                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                  
                  {/* Action Results */}
                  {message.data && message.data.database_results && (
                    <div className="mt-3 p-3 bg-white/10 rounded border border-white/20">
                      <div className="flex items-center gap-2 text-sm font-medium mb-2">
                        <CheckCircle className="w-4 h-4" />
                        Database Updates
                      </div>
                      <div className="text-xs space-y-1">
                        <div>Products: {message.data.database_results.products_added.length} added</div>
                        <div>Categories: {message.data.database_results.categories_created.length} created</div>
                        <div>Purchase List: {message.data.database_results.purchase_list_items.length} items</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-3">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about trending products, create new categories, or get recommendations..."
                className="flex-1 border rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg px-6 py-3 flex items-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              💡 Try: "What are trending products we should stock?" or "Create a new Snacks category"
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Example Queries</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium text-gray-700">Trending Products</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div>• "What are the famous products people are buying online?"</div>
                <div>• "Give me trending products for all categories"</div>
                <div>• "What should we stock to increase sales?"</div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-700">New Categories</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div>• "Create a new Electronics category"</div>
                <div>• "Add a Health & Wellness section"</div>
                <div>• "Create Snacks category with popular items"</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AIAssistantTab;