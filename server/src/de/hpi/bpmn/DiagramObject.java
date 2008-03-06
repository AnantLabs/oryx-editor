package de.hpi.bpmn;

import java.util.ArrayList;
import java.util.List;

/**
 * This is the parent class for Node and Edge. 
 * Why could edges have incoming and outgoing edges? Well, e.g. SequenceFlow can have an undirected association attached
 * 
 * @author gero.decker
 *
 */
public abstract class DiagramObject {

	protected String id;
	protected String resourceId;
	protected List<Edge> outgoingEdges;
	protected List<Edge> incomingEdges;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getResourceId() {
		return resourceId;
	}

	public void setResourceId(String resourceId) {
		this.resourceId = resourceId;
	}

	public List<Edge> getIncomingEdges() {
		if (incomingEdges == null)
			incomingEdges = new ArrayList();
		return incomingEdges;
	}

	public List<Edge> getOutgoingEdges() {
		if (outgoingEdges == null)
			outgoingEdges = new ArrayList();
		return outgoingEdges;
	}
//	Added by Ahmed Awad
	public boolean equals(Object other)
	{
		if (resourceId != null && other instanceof DiagramObject)
			return this.resourceId.equals(((DiagramObject) other).getResourceId());
		else if (this == other)
			return true;
		else
			return false;
	}
}
