package de.hpi.bpmn;

import java.util.ArrayList;
import java.util.List;

public class SubProcess extends Activity implements Container {
	
	protected List<Node> childNodes;
	protected boolean adhoc;
	protected boolean parallelOrdering;  

	public List<Node> getChildNodes() {
		if (childNodes == null)
			childNodes = new ArrayList<Node>();
		return childNodes;
	}

	public boolean isAdhoc() {
		return adhoc;
	}

	public void setAdhoc(boolean adhoc) {
		this.adhoc = adhoc;
	}

	public boolean isParallelOrdering() {
		return parallelOrdering;
	}

	public void setParallelOrdering(boolean parallelOrdering) {
		this.parallelOrdering = parallelOrdering;
	}
	
}
