import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { TemplateSection } from '../types';
import SectionSelector from '../components/SectionSelector';
import SectionRenderer from '../components/report-sections/SectionRenderer';

export default function CreateTemplate() {
  const navigate = useNavigate();
  const { addTemplate } = useData();
  const [templateName, setTemplateName] = useState('');
  const [sections, setSections] = useState<TemplateSection[]>([]);
  const [isNameSaved, setIsNameSaved] = useState(false);
  const [showSectionSelector, setShowSectionSelector] = useState(false);
  const [sectionData, setSectionData] = useState<Record<string, any>>({});

  const handleSaveName = () => {
    if (templateName.trim()) {
      setIsNameSaved(true);
    }
  };

  const handleSelectSection = (sectionType: string, data?: any) => {
    const newSection: TemplateSection = {
      id: Date.now().toString(),
      type: sectionType as any,
      name: data?.name || '',
      data: data?.data || data || {}  // Try both data.data and data
    };
    console.log('Creating section with data:', data);  // Debug
    console.log('Final section:', newSection);  // Debug
    setSections([...sections, newSection]);
    setShowSectionSelector(false);
  };

  const updateSectionData = (sectionId: string, data: any) => {
    setSectionData(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], ...data }
    }));
  };

  const handleRemoveSection = (id: string) => {
    setSections(sections.filter(section => section.id !== id));
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newSections = [...sections];
      [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
      setSections(newSections);
    } else if (direction === 'down' && index < sections.length - 1) {
      const newSections = [...sections];
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
      setSections(newSections);
    }
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }

    if (sections.length === 0) {
      alert('Please add at least one section to your template');
      return;
    }

    addTemplate({
      name: templateName,
      sections: sections
    });

    alert('Template saved successfully!');
    navigate('/');
  };

  const getSectionColor = (type: string) => {
    const colors = {
      'rated-comment': '#3b82f6',
      'standard-comment': '#10b981',
      'assessment-comment': '#f59e0b',
      'personalised-comment': '#8b5cf6',
      'optional-additional-comment': '#ef4444',
      'next-steps': '#06b6d4',
      'new-line': '#6b7280'
    };
    return colors[type as keyof typeof colors] || '#6b7280';
  };

  const getSectionDisplayName = (type: string) => {
    const names = {
      'rated-comment': 'Rated Comment',
      'standard-comment': 'Standard Comment',
      'assessment-comment': 'Assessment Comment',
      'personalised-comment': 'Personalised Comment',
      'optional-additional-comment': 'Optional Additional Comment',
      'next-steps': 'Next Steps',
      'new-line': 'New Line'
    };
    return names[type as keyof typeof names] || type;
  };

  // Show SectionSelector if requested
  if (showSectionSelector) {
    return (
      <SectionSelector 
        onSelectSection={handleSelectSection}
        onBack={() => setShowSectionSelector(false)}
      />
    );
  }

  // Show name entry screen if name not saved
  if (!isNameSaved) {
    return (
      <div style={{ 
        padding: '20px', 
        maxWidth: '800px', 
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#1f2937',
            margin: 0 
          }}>
            Create Report Template
          </h1>
          <Link 
            to="/" 
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '14px'
            }}
          >
            Back to Home
          </Link>
        </div>

        <div style={{
          backgroundColor: '#f9fafb',
          border: '2px solid #e5e7eb',
          borderRadius: '8px',
          padding: '32px',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: '#374151',
            marginBottom: '16px'
          }}>
            Name Your Template
          </h2>
          
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="e.g. S1 Reports PE"
            style={{
              width: '300px',
              padding: '12px',
              border: '2px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px',
              marginBottom: '20px',
              outline: 'none'
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
          />
          
          <br />
          
          <button
            onClick={handleSaveName}
            disabled={!templateName.trim()}
            style={{
              backgroundColor: templateName.trim() ? '#3b82f6' : '#9ca3af',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: templateName.trim() ? 'pointer' : 'not-allowed',
              fontWeight: '600'
            }}
          >
            Continue to Template Builder
          </button>
        </div>
      </div>
    );
  }

  // Main template builder screen
  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#1f2937',
          margin: 0 
        }}>
          Template Builder: {templateName}
        </h1>
        <Link 
          to="/" 
          style={{
            backgroundColor: '#6b7280',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '14px'
          }}
        >
          Back to Home
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Left Column - Template Builder */}
        <div style={{ flex: '1' }}>
          {/* Student Name Section */}
          <div style={{
            backgroundColor: '#f3f4f6',
            border: '2px solid #d1d5db',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#374151',
              margin: '0 0 12px 0'
            }}>
              Student Information
            </h3>
            <div style={{ 
              fontSize: '14px', 
              color: '#6b7280',
              fontStyle: 'italic'
            }}>
              First Name and Last Name will automatically appear in reports
            </div>
          </div>

          {/* Template Sections */}
          {sections.map((section, index) => (
            <div key={section.id} style={{
              backgroundColor: 'white',
              border: `2px solid ${getSectionColor(section.type)}`,
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px',
              position: 'relative'
            }}>
              {/* Section Header with Remove Button */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '16px',
                paddingBottom: '12px',
                borderBottom: `1px solid ${getSectionColor(section.type)}33`
              }}>
                <div>
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    color: getSectionColor(section.type),
                    margin: 0
                  }}>
                    {index + 1}. {section.data?.name || section.name || `Section ${index + 1}`}
                  </h3>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280',
                    margin: '4px 0 0 0',
                    fontStyle: 'italic'
                  }}>
                    {getSectionDisplayName(section.type)} - Template Builder Preview
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '4px'
                }}>
                  {/* Move Up Button */}
                  <button
                    onClick={() => handleMoveSection(index, 'up')}
                    disabled={index === 0}
                    style={{
                      backgroundColor: index === 0 ? '#d1d5db' : '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 8px',
                      fontSize: '12px',
                      cursor: index === 0 ? 'not-allowed' : 'pointer',
                      fontWeight: '500'
                    }}
                    title="Move up"
                  >
                    ↑
                  </button>
                  
                  {/* Move Down Button */}
                  <button
                    onClick={() => handleMoveSection(index, 'down')}
                    disabled={index === sections.length - 1}
                    style={{
                      backgroundColor: index === sections.length - 1 ? '#d1d5db' : '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 8px',
                      fontSize: '12px',
                      cursor: index === sections.length - 1 ? 'not-allowed' : 'pointer',
                      fontWeight: '500'
                    }}
                    title="Move down"
                  >
                    ↓
                  </button>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveSection(section.id)}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* WYSIWYG Section Preview - Exactly what teachers will see */}
              <div style={{
                border: '1px dashed #d1d5db',
                borderRadius: '6px',
                padding: '16px',
                backgroundColor: '#fafafa'
              }}>
                <SectionRenderer
                  section={section}
                  sectionData={sectionData}
                  updateSectionData={updateSectionData}
                />
              </div>
            </div>
          ))}

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            marginTop: '20px'
          }}>
            <button
              onClick={() => setShowSectionSelector(true)}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Add Section
            </button>
            
            <button
              onClick={handleSaveTemplate}
              disabled={sections.length === 0}
              style={{
                backgroundColor: sections.length > 0 ? '#3b82f6' : '#9ca3af',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: sections.length > 0 ? 'pointer' : 'not-allowed',
                fontWeight: '600'
              }}
            >
              Save Template
            </button>
          </div>
        </div>

        {/* Right Column - Instructions */}
        <div style={{ 
          width: '300px',
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#374151',
            marginBottom: '16px'
          }}>
            Template Builder Guide
          </h3>
          
          <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
            <p style={{ marginBottom: '12px' }}>
              <strong>Add Sections:</strong> Use the "Add Section" button to build your template with different types of comments and inputs.
            </p>
            
            <p style={{ marginBottom: '12px' }}>
              <strong>Preview:</strong> What you see here is exactly what teachers will see when writing reports.
            </p>
            
            <p style={{ marginBottom: '12px' }}>
              <strong>Placeholders:</strong> Use [Name] in comments to automatically insert student names.
            </p>
            
            <p style={{ marginBottom: '12px' }}>
              <strong>Order Matters:</strong> Sections will appear in reports in the same order as shown here.
            </p>
            
            <p>
              <strong>Save:</strong> Don't forget to save your template when you're finished!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}