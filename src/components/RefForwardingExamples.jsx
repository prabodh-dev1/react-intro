import React, { useRef, forwardRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// --- Input Component with forwardRef ---
const MyInput = forwardRef(({ label, ...props }, ref) => (
  <div className="space-y-2">
    {label && <Label>{label}</Label>}
    <Input ref={ref} {...props} />
  </div>
));

// --- HOC with Ref Forwarding ---
function withFocusLogging(WrappedComponent) {
  const ComponentWithFocusLogging = forwardRef((props, ref) => {
    const internalRef = useRef(null);

    // Combine the internal ref with the forwarded ref
    const combinedRef = (node) => {
      internalRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const handleFocus = () => {
      console.log(`Input focused in ${WrappedComponent.displayName || WrappedComponent.name}`);
    };

    return (
      <WrappedComponent
        ref={combinedRef}
        onFocus={handleFocus}
        {...props}
      />
    );
  });

  ComponentWithFocusLogging.displayName = `WithFocusLogging(${WrappedComponent.displayName || WrappedComponent.name})`;
  return ComponentWithFocusLogging;
}

const InputWithFocusLogging = withFocusLogging(MyInput);

function RefForwardingExamples() {
  const inputRef = useRef(null);
  const hocInputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  const focusHocInput = () => {
    hocInputRef.current.focus();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Forwarding Refs</h2>
      <p className="text-gray-700 dark:text-gray-300">
        <code>forwardRef</code> allows you to pass a ref from a parent component down to a child component, enabling the parent to directly interact with the child's DOM element or instance.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic forwardRef Example */}
        <Card>
          <CardHeader>
            <CardTitle>Basic forwardRef</CardTitle>
            <CardDescription>Passing a ref to a custom input component</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <MyInput ref={inputRef} label="Focus me:" placeholder="Type something..." />
            <Button onClick={focusInput}>Focus Input</Button>
            <p className="text-sm text-gray-500">
              The parent component can directly focus the input inside <code>MyInput</code>.
            </p>
          </CardContent>
        </Card>

        {/* forwardRef with HOC Example */}
        <Card>
          <CardHeader>
            <CardTitle>forwardRef with HOC</CardTitle>
            <CardDescription>Forwarding refs through a Higher-Order Component</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <InputWithFocusLogging ref={hocInputRef} label="Focus with HOC:" placeholder="Check console..." />
            <Button onClick={focusHocInput}>Focus HOC Input</Button>
            <p className="text-sm text-gray-500">
              The ref is successfully passed through the <code>withFocusLogging</code> HOC to the underlying input.
              Check the console for focus events.
            </p>
          </CardContent>
        </Card>

        {/* Integration with Focus Management (Conceptual) */}
        <Card>
          <CardHeader>
            <CardTitle>Integration with Focus Management</CardTitle>
            <CardDescription>Building accessible components</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              <code>forwardRef</code> is crucial for building accessible components, especially when managing focus within complex UI elements like modals, dropdowns, or forms.
            </p>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto">
{`// Example: Auto-focusing a modal input
const ModalWithAutoFocus = forwardRef(({ isOpen, ...props }, ref) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <Modal {...props}>
      <input ref={inputRef} />
    </Modal>
  );
});`}
            </pre>
            <p className="text-sm text-gray-500">
              This pattern ensures that focus can be programmatically controlled, improving keyboard navigation and overall accessibility.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default RefForwardingExamples;


