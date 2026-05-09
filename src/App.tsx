import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Sparkles, CreditCard as Edit2, Check, X } from 'lucide-react';

type Priority = 'high' | 'medium' | 'low';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: number;
}

type FilterType = 'all' | 'active' | 'completed';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const stored = localStorage.getItem('todos');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [priority, setPriority] = useState<Priority>('medium');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    setTodos(prev => [
      { id: crypto.randomUUID(), text, completed: false, priority, createdAt: Date.now() },
      ...prev,
    ]);
    setInput('');
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  const saveEdit = () => {
    if (!editingText.trim() || !editingId) return;
    setTodos(prev =>
      prev.map(t => (t.id === editingId ? { ...t, text: editingText.trim() } : t))
    );
    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const clearAll = () => {
    if (window.confirm('确定要清空所有任务吗？此操作无法撤销。')) {
      setTodos([]);
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos(prev => prev.filter(t => !t.completed));
  };

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 flex flex-col items-center px-4 py-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-300 animate-pulse">
          <Sparkles size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-slate-800 leading-tight">我的待办清单</h1>
          <p className="text-sm text-slate-400 mt-1">每个任务都闪闪发光</p>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-blue-100/60 overflow-hidden">
        {/* Input area */}
        <div className="p-6 border-b border-slate-100 space-y-3">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTodo()}
              placeholder="今天要做什么？"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-slate-700 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
            <button
              onClick={addTodo}
              className="px-5 h-12 flex-shrink-0 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 active:from-blue-700 active:to-cyan-700 text-white rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-blue-200 transition-all duration-150 hover:shadow-lg hover:shadow-blue-300 hover:-translate-y-0.5 active:translate-y-0 font-medium text-sm"
            >
              <Plus size={18} strokeWidth={2.5} />
              <span className="hidden sm:inline">添加任务</span>
            </button>
          </div>
          <div className="flex gap-2">
            {(['high', 'medium', 'low'] as Priority[]).map(p => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  priority === p
                    ? p === 'high'
                      ? 'bg-red-500 text-white shadow-md shadow-red-200'
                      : p === 'medium'
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                      : 'bg-blue-400 text-white shadow-md shadow-blue-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p === 'high' ? '高' : p === 'medium' ? '中' : '低'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 py-4 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between">
          <div className="flex gap-5">
            <span className="text-sm text-slate-500">
              未完成
              <span className="ml-1.5 text-blue-600 font-semibold">{activeCount}</span>
            </span>
            <span className="text-sm text-slate-500">
              已完成
              <span className="ml-1.5 text-emerald-500 font-semibold">{completedCount}</span>
            </span>
          </div>
          <div className="flex gap-2">
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="text-xs px-3 py-1 rounded-full text-white bg-red-400 hover:bg-red-500 active:bg-red-600 transition-colors font-medium shadow-sm shadow-red-200"
              >
                清空已完成
              </button>
            )}
            {todos.length > 0 && (
              <button
                onClick={clearAll}
                className="text-xs px-3 py-1 rounded-full text-white bg-slate-400 hover:bg-slate-500 active:bg-slate-600 transition-colors font-medium shadow-sm shadow-slate-200"
              >
                全部清空
              </button>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="px-6 pt-5 pb-2 flex gap-1">
          {(['all', 'active', 'completed'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === f
                  ? 'bg-blue-500 text-white shadow-sm shadow-blue-200'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
            >
              {f === 'all' ? '全部' : f === 'active' ? '进行中' : '已完成'}
            </button>
          ))}
        </div>

        {/* Todo list */}
        <ul className="px-4 pb-4 min-h-[120px] max-h-[460px] overflow-y-auto space-y-2">
          {filtered.length === 0 ? (
            <li className="flex flex-col items-center justify-center py-16 text-slate-300 select-none">
              <Sparkles size={40} strokeWidth={1.2} className="mb-3" />
              <span className="text-sm font-medium">
                {filter === 'completed'
                  ? '还没有完成的任务，加油！'
                  : filter === 'active'
                  ? '没有进行中的任务，休息一下吧'
                  : '还没有任务，快来添加吧'}
              </span>
            </li>
          ) : (
            filtered.map(todo => (
              <li
                key={todo.id}
                className={`group flex items-center gap-3 px-3 py-3.5 rounded-2xl border-l-4 transition-all ${
                  todo.priority === 'high'
                    ? 'border-red-400 hover:bg-red-50'
                    : todo.priority === 'medium'
                    ? 'border-amber-400 hover:bg-amber-50'
                    : 'border-blue-400 hover:bg-blue-50'
                }`}
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className="flex-shrink-0 transition-transform hover:scale-110 active:scale-95"
                >
                  {todo.completed ? (
                    <CheckCircle2 size={22} className="text-emerald-400" />
                  ) : (
                    <Circle
                      size={22}
                      className={`group-hover:text-opacity-70 transition-colors ${
                        todo.priority === 'high'
                          ? 'text-red-300 group-hover:text-red-400'
                          : todo.priority === 'medium'
                          ? 'text-amber-300 group-hover:text-amber-400'
                          : 'text-blue-300 group-hover:text-blue-400'
                      }`}
                    />
                  )}
                </button>
                {editingId === todo.id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      autoFocus
                      type="text"
                      value={editingText}
                      onChange={e => setEditingText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      className="flex-1 bg-white border border-blue-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                      onClick={saveEdit}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-emerald-500 hover:bg-emerald-50 transition-colors"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span
                      className={`flex-1 text-sm leading-snug transition-colors cursor-text ${
                        todo.completed ? 'line-through text-slate-300' : 'text-slate-700'
                      }`}
                      onDoubleClick={() => startEdit(todo)}
                    >
                      {todo.text}
                    </span>
                    <button
                      onClick={() => startEdit(todo)}
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center rounded-xl text-slate-300 hover:text-blue-500 hover:bg-blue-50 transition-all"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center rounded-xl text-slate-300 hover:text-red-400 hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={15} />
                    </button>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      </div>

      <p className="mt-8 text-xs text-slate-400">数据自动保存在本地，刷新不丢失</p>
    </div>
  );
}
