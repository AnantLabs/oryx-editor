package de.hpi.petrinet.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Vector;

import de.hpi.execpn.pnml.Locator;
import de.hpi.petrinet.FlowRelationship;
import de.hpi.petrinet.Node;
import de.hpi.petrinet.Place;
import de.hpi.petrinet.Transition;

public abstract class NodeImpl implements Node {

	protected String id;
	private List<FlowRelationship> incomingFlowRelationships;
	private List<FlowRelationship> outgoingFlowRelationships;
	private String guard;
	private Vector<Locator> locators = new Vector<Locator>();

	public String getId() {
		return id;
	}

	public void setId(String label) {
		label = label.replace("#","");
		if (this instanceof Place) {
			label = "place_" + label; 
		} else if (this instanceof Transition) {
			label = "transition_" + label;
		}
		
		this.id = label;
	}

	public List<FlowRelationship> getIncomingFlowRelationships() {
		if (incomingFlowRelationships == null)
			incomingFlowRelationships = new ArrayList();
		return incomingFlowRelationships;
	}

	public List<FlowRelationship> getOutgoingFlowRelationships() {
		if (outgoingFlowRelationships == null)
			outgoingFlowRelationships = new ArrayList();
		return outgoingFlowRelationships;
	}

	public String toString() {
		return getId();
	}

	public String getGuard() {
		return guard;
	}

	public void setGuard(String guard) {
		this.guard = guard;
	}

	public Vector<Locator> getLocators() {
		return locators;
	}

	public void addLocator(Locator locator) {
		this.locators.add(locator);
	}
	
}
