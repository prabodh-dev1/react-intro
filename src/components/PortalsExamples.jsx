import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// --- Modal Component using createPortal ---
const PortalModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-2xl"
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.body // Render into the body element
  );
};

// --- Tooltip Component with Portal ---
const Tooltip = ({ children, content }) => {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const tooltipRef = React.useRef(null);

  const handleMouseEnter = (e) => {
    setShow(true);
    setCoords({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setShow(false);
  };

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative inline-block cursor-help"
    >
      {children}
      {show && ReactDOM.createPortal(
        <div
          ref={tooltipRef}
          style={{
            position: 'absolute',
            top: coords.y + 15, // Offset from cursor
            left: coords.x + 15,
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '0.85rem',
            zIndex: 10000,
            whiteSpace: 'nowrap',
          }}
        >
          {content}
        </div>,
        document.body
      )}
    </span>
  );
};

// --- Toast Notification System (Conceptual) ---
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

  return ReactDOM.createPortal(
    <div className={`fixed bottom-4 right-4 p-4 rounded-md text-white shadow-lg ${bgColor} z-[9999]`}>
      {message}
      <button onClick={onClose} className="ml-4 text-white font-bold">&times;</button>
    </div>,
    document.body
  );
};

function PortalsExamples() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState(null);

  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">React Portals</h2>
      <p className="text-gray-700 dark:text-gray-300">
        React Portals provide a way to render children into a DOM node that exists outside the DOM hierarchy of the parent component.
        This is useful for modals, tooltips, and notifications that need to escape the parent's styling or z-index.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Modal Example */}
        <Card>
          <CardHeader>
            <CardTitle>Modal Component</CardTitle>
            <CardDescription>Rendered outside the component hierarchy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => setIsModalOpen(true)}>Open Portal Modal</Button>
            <PortalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <h3 className="text-xl font-semibold mb-2">Portal Modal Title</h3>
              <p className="text-gray-700 dark:text-gray-300">This modal is rendered directly into the document body, allowing it to bypass parent CSS rules like `overflow: hidden` or `z-index` limitations.</p>
              <Button onClick={() => setIsModalOpen(false)} className="mt-4">Close Modal</Button>
            </PortalModal>
          </CardContent>
        </Card>

        {/* Tooltip Example */}
        <Card>
          <CardHeader>
            <CardTitle>Tooltip Component</CardTitle>
            <CardDescription>Ensures tooltip is always on top</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Hover over this <Tooltip content="This is a helpful tooltip!"><span className="underline cursor-help">text</span></Tooltip> to see a portal-rendered tooltip.
            </p>
            <p className="text-sm text-gray-500">
              Portals are great for elements that need to appear above all other content.
            </p>
          </CardContent>
        </Card>

        {/* Toast Notification Example (Conceptual) */}
        <Card>
          <CardHeader>
            <CardTitle>Toast Notification (Conceptual)</CardTitle>
            <CardDescription>Ideal for global notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Toast notifications often need to appear outside the normal document flow. Portals are perfect for this.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => showToast("Action successful!", "success")}>Show Success Toast</Button>
              <Button variant="destructive" onClick={() => showToast("Error occurred!", "error")}>Show Error Toast</Button>
            </div>
            {toastMessage && (
              <Toast
                message={toastMessage}
                type={toastType}
                onClose={() => setToastMessage(null)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PortalsExamples;


