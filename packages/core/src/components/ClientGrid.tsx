"use client";

import { forwardRef } from "react";
import { ServerGrid, Cursor } from ".";
import { GridProps, StyleProps, DisplayProps } from "../interfaces";
import { useRef, useEffect, useCallback, CSSProperties, useState } from "react";
import { useLayout } from "..";

interface ClientGridProps extends GridProps, StyleProps, DisplayProps {
  cursor?: StyleProps["cursor"];
  xl?: any;
  l?: any;
  m?: any;
  s?: any;
  xs?: any;
  hide?: boolean;
}

const ClientGrid = forwardRef<HTMLDivElement, ClientGridProps>(({ cursor, hide, xl, l, m, s, xs, ...props }, ref) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const { currentBreakpoint } = useLayout();
  
  // Combine refs
  const combinedRef = (node: HTMLDivElement) => {
    elementRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };
  const appliedResponsiveStyles = useRef<Set<string>>(new Set());
  const baseStyleRef = useRef<CSSProperties>({});

  // Responsive styles logic (client-side only)
  const applyResponsiveStyles = useCallback(() => {
    if (!elementRef.current) return;
    
    const element = elementRef.current;
    
    // Update base styles when style prop changes
    if (props.style) {
      baseStyleRef.current = { ...props.style };
    }
    
    // Determine which responsive props to apply based on current breakpoint
    let currentResponsiveProps: any = null;
    if (currentBreakpoint === 'xl' && xl) {
      currentResponsiveProps = xl;
    } else if (currentBreakpoint === 'l' && l) {
      currentResponsiveProps = l;
    } else if (currentBreakpoint === 'm' && m) {
      currentResponsiveProps = m;
    } else if (currentBreakpoint === 's' && s) {
      currentResponsiveProps = s;
    } else if (currentBreakpoint === 'xs' && xs) {
      currentResponsiveProps = xs;
    }
    
    // Clear only responsive styles, not base styles
    appliedResponsiveStyles.current.forEach(key => {
      (element.style as any)[key] = '';
    });
    appliedResponsiveStyles.current.clear();
    
    // Reapply base styles
    if (baseStyleRef.current) {
      Object.entries(baseStyleRef.current).forEach(([key, value]) => {
        (element.style as any)[key] = value;
      });
    }
    
    // Apply new responsive styles if we have them for current breakpoint
    if (currentResponsiveProps) {
      if (currentResponsiveProps.style) {
        Object.entries(currentResponsiveProps.style).forEach(([key, value]) => {
          (element.style as any)[key] = value;
          appliedResponsiveStyles.current.add(key);
        });
      }
      if (currentResponsiveProps.aspectRatio) {
        element.style.aspectRatio = currentResponsiveProps.aspectRatio;
        appliedResponsiveStyles.current.add('aspect-ratio');
      }
    }
  }, [xl, l, m, s, xs, props.style, currentBreakpoint]);

  useEffect(() => {
    applyResponsiveStyles();
  }, [applyResponsiveStyles]);

  // Detect touch device
  useEffect(() => {
    const checkTouchDevice = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const hasPointer = window.matchMedia('(pointer: fine)').matches;
      setIsTouchDevice(hasTouch && !hasPointer);
    };

    checkTouchDevice();
    
    const mediaQuery = window.matchMedia('(pointer: fine)');
    const handlePointerChange = () => checkTouchDevice();
    
    mediaQuery.addEventListener('change', handlePointerChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handlePointerChange);
    };
  }, []);

  // Determine if we should hide the default cursor
  const shouldHideCursor = typeof cursor === 'object' && cursor && !isTouchDevice;
  
  // Determine if we should apply the hide class based on current breakpoint
  const shouldApplyHideClass = () => {
    try {
      const { currentBreakpoint } = useLayout();
      
      // Logic matching the shouldHide function in Grid component
      if (currentBreakpoint === 'xl') {
        if (xl?.hide !== undefined) return xl.hide === true;
        return hide === true;
      }
      
      if (currentBreakpoint === 'l') {
        if (l?.hide !== undefined) return l.hide === true;
        return hide === true;
      }
      
      if (currentBreakpoint === 'm') {
        if (m?.hide !== undefined) return m.hide === true;
        if (l?.hide !== undefined) return l.hide === true;
        if (xl?.hide !== undefined) return xl.hide === true;
        return hide === true;
      }
      
      if (currentBreakpoint === 's') {
        if (s?.hide !== undefined) return s.hide === true;
        if (m?.hide !== undefined) return m.hide === true;
        if (l?.hide !== undefined) return l.hide === true;
        if (xl?.hide !== undefined) return xl.hide === true;
        return hide === true;
      }
      
      if (currentBreakpoint === 'xs') {
        if (xs?.hide !== undefined) return xs.hide === true;
        if (s?.hide !== undefined) return s.hide === true;
        if (m?.hide !== undefined) return m.hide === true;
        if (l?.hide !== undefined) return l.hide === true;
        if (xl?.hide !== undefined) return xl.hide === true;
        return hide === true;
      }
      
      return hide === true;
    } catch {
      return hide === true;
    }
  };
  
  // Apply hide class only if it should be hidden at current breakpoint
  const effectiveHide = shouldApplyHideClass();

  return (
    <>
      <ServerGrid 
        {...props} 
        xl={xl}
        l={l}
        m={m}
        s={s}
        xs={xs}
        hide={effectiveHide}
        ref={combinedRef}
        style={{
          ...props.style,
          cursor: shouldHideCursor ? 'none' : props.style?.cursor
        }}
      />
      {typeof cursor === 'object' && cursor && !isTouchDevice && (
        <Cursor cursor={cursor} elementRef={elementRef} />
      )}
    </>
  );
});

ClientGrid.displayName = "ClientGrid";
export { ClientGrid };