package com.qreal.robots.dao;

import com.qreal.robots.model.diagram.Diagram;

/**
 * Created by vladzx on 22.06.15.
 */
public interface DiagramDAO {

    public void save(Diagram diagram);

    public Diagram openById(Long diagramId);

    public Diagram openByName(String name);
}
