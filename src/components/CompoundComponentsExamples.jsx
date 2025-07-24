import React, { useState, createContext, useContext } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// --- Accordion Component (Compound Pattern) ---
const AccordionContext = createContext();

const Accordion = ({ children, defaultValue, onValueChange }) => {
  const [openItem, setOpenItem] = useState(defaultValue);

  const toggleItem = (value) => {
    const newValue = openItem === value ? null : value;
    setOpenItem(newValue);
    onValueChange && onValueChange(newValue);
  };

  return (
    <AccordionContext.Provider value={{ openItem, toggleItem }}>
      <div className="space-y-2">
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

const AccordionItem = ({ value, children }) => {
  const { openItem, toggleItem } = useContext(AccordionContext);
  const isOpen = openItem === value;

  return (
    <Card className="border">
      {children(isOpen, () => toggleItem(value))}
    </Card>
  );
};

const AccordionTrigger = ({ children, onClick }) => {
  return (
    <CardHeader className="p-4 cursor-pointer" onClick={onClick}>
      <CardTitle className="text-lg">{children}</CardTitle>
    </CardHeader>
  );
};

const AccordionContent = ({ children, isOpen }) => {
  return (
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
      <CardContent className="p-4 pt-0">
        {children}
      </CardContent>
    </div>
  );
};

// --- Modal Component (Compound Pattern) ---
const ModalContext = createContext();

const Modal = ({ children, isOpen, onClose }) => {
  return (
    <ModalContext.Provider value={{ isOpen, onClose }}>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md relative">
            {children}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

const ModalHeader = ({ children }) => {
  const { onClose } = useContext(ModalContext);
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-semibold">{children}</h3>
      <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
    </div>
  );
};

const ModalContent = ({ children }) => {
  return (
    <div className="mb-4">
      {children}
    </div>
  );
};

const ModalFooter = ({ children }) => {
  return (
    <div className="flex justify-end space-x-2">
      {children}
    </div>
  );
};

function CompoundComponentsExamples() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Compound Components Pattern</h2>
      <p className="text-gray-700 dark:text-gray-300">
        The Compound Components pattern allows you to build components that work together to achieve a shared state and logic, but without creating a single, monolithic component.
        It provides a flexible and expressive API for complex UI elements.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Accordion Example */}
        <Card>
          <CardHeader>
            <CardTitle>Accordion Example</CardTitle>
            <CardDescription>Flexible API for collapsible content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Accordion defaultValue="item-1">
              <AccordionItem value="item-1">
                {(isOpen, toggle) => (
                  <>
                    <AccordionTrigger onClick={toggle}>What is React?</AccordionTrigger>
                    <AccordionContent isOpen={isOpen}>
                      React is a JavaScript library for building user interfaces, particularly single-page applications.
                    </AccordionContent>
                  </>
                )}
              </AccordionItem>
              <AccordionItem value="item-2">
                {(isOpen, toggle) => (
                  <>
                    <AccordionTrigger onClick={toggle}>What are Hooks?</AccordionTrigger>
                    <AccordionContent isOpen={isOpen}>
                      Hooks are functions that let you use state and other React features without writing a class.
                    </AccordionContent>
                  </>
                )}
              </AccordionItem>
              <AccordionItem value="item-3">
                {(isOpen, toggle) => (
                  <>
                    <AccordionTrigger onClick={toggle}>Why Compound Components?</AccordionTrigger>
                    <AccordionContent isOpen={isOpen}>
                      They provide a clear separation of concerns, better reusability, and a more intuitive API for users of the component.
                    </AccordionContent>
                  </>
                )}
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Modal Example */}
        <Card>
          <CardHeader>
            <CardTitle>Modal Example</CardTitle>
            <CardDescription>Building a flexible dialog with compound components</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <ModalHeader>Confirm Action</ModalHeader>
              <ModalContent>
                <p className="text-gray-700 dark:text-gray-300">
                  Are you sure you want to proceed with this action? This cannot be undone.
                </p>
              </ModalContent>
              <ModalFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button onClick={() => {
                  alert("Action Confirmed!");
                  setIsModalOpen(false);
                }}>Confirm</Button>
              </ModalFooter>
            </Modal>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CompoundComponentsExamples;


