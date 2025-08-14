import React, { useState } from 'react';
import { TemplateSection } from '../../types';

interface PersonalisedCommentSectionProps {
  section: TemplateSection;
  data: any;
  updateSectionData: (sectionId: string, data: any) => void;
}

const PersonalisedCommentSection: React.FC<PersonalisedCommentSectionProps> = ({
  section,
  data,
  updateSectionData
}) => {
  const [showPersonalisedInput, setShowPersonalisedInput] = useState(false);

  const categories = section.data?.categories ? Object.keys(section.data.categories) : [];

  return (
    <div style={{
      border: '2px solid #8b5cf6',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      backgroundColor: '#f3e8ff'
    }}>
      {/* Compact Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#7c3aed',
          margin: 0
        }}>
          {section.name || 'Personalised Comment'}
        </h3>
        
        {/* Header Options */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <input
              type="checkbox"
              checked={data.showHeader !== false}
              onChange={(e) => updateSectionData(section.id, { showHeader: e.target.checked })}
              style={{
                width: '14px',
                height: '14px',
                cursor: 'pointer'
              }}
            />
            <span style={{
              fontSize: '12px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Header
            </span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <input
              type="checkbox"
              checked={data.exclude || false}
              onChange={(e) => updateSectionData(section.id, { exclude: e.target.checked })}
              style={{
                width: '14px',
                height: '14px',
                cursor: 'pointer'
              }}
            />
            <span style={{
              fontSize: '12px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Exclude
            </span>
          </div>
        </div>
      </div>

      {/* Instruction Text - Updated */}
      {section.data?.instruction && (
        <div style={{
          fontSize: '12px',
          color: '#6b7280',
          fontStyle: 'italic',
          marginBottom: '8px',
          padding: '6px 8px',
          backgroundColor: 'white',
          borderRadius: '4px',
          border: '1px solid #d1d5db'
        }}>
          {section.data.instruction}
        </div>
      )}

      {/* Compact Personalised Info Entry */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setShowPersonalisedInput(!showPersonalisedInput)}
          style={{
            backgroundColor: showPersonalisedInput ? '#8b5cf6' : '#e5e7eb',
            color: showPersonalisedInput ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '12px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          {showPersonalisedInput ? 'Hide' : 'Add Info'}
        </button>

        {/* Inline preview of personalised info */}
        {!showPersonalisedInput && data.personalisedInfo && (
          <span style={{
            fontSize: '12px',
            color: '#7c3aed',
            fontWeight: '500',
            backgroundColor: 'white',
            padding: '2px 6px',
            borderRadius: '3px',
            border: '1px solid #8b5cf6'
          }}>
            "{data.personalisedInfo.substring(0, 30)}{data.personalisedInfo.length > 30 ? '...' : ''}"
          </span>
        )}
      </div>

      {/* Expandable Personalised Info Input */}
      {showPersonalisedInput && (
        <div style={{ marginBottom: '12px' }}>
          <input
            type="text"
            value={data.personalisedInfo || ''}
            onChange={(e) => updateSectionData(section.id, { personalisedInfo: e.target.value })}
            placeholder="Enter personalised information..."
            style={{
              width: '100%',
              padding: '6px 8px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>
      )}

      {/* Show Available Categories/Headings */}
      {categories.length > 0 && (
        <div style={{ marginBottom: '8px' }}>
          <div style={{
            fontSize: '12px',
            color: '#6b7280',
            marginBottom: '6px',
            fontWeight: '500'
          }}>
            Available headings:
          </div>
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => updateSectionData(section.id, { category })}
                style={{
                  backgroundColor: data.category === category ? '#8b5cf6' : 'white',
                  color: data.category === category ? 'white' : '#7c3aed',
                  border: `2px solid #8b5cf6`,
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  minWidth: 'auto',
                  whiteSpace: 'nowrap'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No categories fallback */}
      {categories.length === 0 && (
        <div style={{
          fontSize: '12px',
          color: '#6b7280',
          fontStyle: 'italic',
          textAlign: 'center',
          padding: '8px'
        }}>
          No headings configured for this section
        </div>
      )}
    </div>
  );
};

export default PersonalisedCommentSection;