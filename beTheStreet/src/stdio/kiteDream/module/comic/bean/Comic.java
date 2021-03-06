package stdio.kiteDream.module.comic.bean;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.codehaus.jackson.map.annotate.JsonSerialize;

import stdio.kiteDream.module.image.bean.Image.Type;

@Entity
@Table(name = "comic")
public class Comic implements Serializable {

	private static final long serialVersionUID = 5225179050020856446L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;

	private int level;

	private int orderNum;
	
	private Type type;

	private String path;
	
	private String thumbnail_path;
	
	public Comic() {
	}
	
	public Comic(String path,String thumbnail_path) {
		this.path = path;
		this.thumbnail_path = thumbnail_path;
	}
	
	@JsonSerialize(using = BasePathJsonParser.class)
	public String getThumbnail_path() {
		return thumbnail_path;
	}

	public void setThumbnail_path(String thumbnail_path) {
		this.thumbnail_path = thumbnail_path;
	}


	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getLevel() {
		return level;
	}

	public void setLevel(int level) {
		this.level = level;
	}


	public int getOrderNum() {
		return orderNum;
	}

	public void setOrderNum(int orderNum) {
		this.orderNum = orderNum;
	}
	
	@JsonSerialize(using = BasePathJsonParser.class)
	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public Type getType() {
		return type;
	}

	public void setType(Type type) {
		this.type = type;
	}

}
