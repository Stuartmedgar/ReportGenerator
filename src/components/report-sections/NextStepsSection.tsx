import React, { useState } from 'react';
import { TemplateSection } from '../../types';

interface NextStepsSectionProps {
  section: TemplateSection;
  data: any;
  updateSectionData: (sectionId: string, data: any) => void;
}

const NextStepsSection: React.FC<NextStepsSectionProps> = ({
  section,
  data,
  updateSectionData
}) => {
  const [showCustomSuggestion, setShowCustomSuggestion] = useState(false);

  const focusAreas = section.data?.focusAreas ? Object.keys(section.data.focusAreas) : [];

  return (
    <div style={{
      border: '2px solid #06b6d4',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      backgroundColor: '#ecfeff'
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
          color: '#0891b2',
          margin: 0
        }}>
          {section.name || 'Next Steps'}
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

      {/* Focus Areas */}
      {focusAreas.length > 0 && (
        <div style={{ marginBottom: '8px' }}>
          <div style={{
            fontSize: '12px',
            color: '#6b7280',
            marginBottom: '6px',
            fontWeight: '500'
          }}>
            Focus Area:
          </div>
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            {focusAreas.map((area) => (
              <button
                key={area}
                onClick={() => updateSectionData(section.id, { focusArea: area })}
                style={{
                  backgroundColor: data.focusArea === area ? '#06b6d4' : 'white',
                  color: data.focusArea === area ? 'white' : '#0891b2',
                  border: `2px solid #06b6d4`,
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  minWidth: 'auto',
                  whiteSpace: 'nowrap'
                }}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Suggestion Toggle */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-start',
        marginBottom: showCustomSuggestion ? '12px' : '0'
      }}>
        <button
          onClick={() => setShowCustomSuggestion(!showCustomSuggestion)}
          style={{
            backgroundColor: showCustomSuggestion ? '#06b6d4' : '#e5e7eb',
            color: showCustomSuggestion ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '12px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          {showCustomSuggestion ? '- Custom' : '+ Custom'}
        </button>
      </div>

      {/* Collapsible Custom Suggestion */}
      {showCustomSuggestion && (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          padding: '8px'
        }}>
          <textarea
            value={data.customSuggestion || ''}
            onChange={(e) => updateSectionData(section.id, { customSuggestion: e.target.value })}
            placeholder="Add custom next steps suggestion..."
            style={{
              width: '100%',
              minHeight: '50px',
              padding: '6px',
              border: 'none',
              borderRadius: '4px',
              resize: 'vertical',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>
      )}

      {/* No focus areas fallback */}
      {focusAreas.length === 0 && (
        <div style={{
          fontSize: '12px',
          color: '#6b7280',
          fontStyle: 'italic',
          textAlign: 'center',
          padding: '8px'
        }}>
          No focus areas configured for this section
        </div>
      )}
    </div>
  );
};

export default NextStepsSection;